import { lstatSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, extname, sep } from 'node:path';
import type { DiscoveredFile, FileLanguage } from '@mcp-trust/core';

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  '.next',
  '.turbo',
  'coverage',
  '__pycache__',
  '.venv',
  'venv',
  'vendor',
]);

const MAX_FILE_BYTES = 512 * 1024; // skip files larger than 512 KB
const MAX_FILES = 2000; // cap on scannable files actually loaded
const MAX_ENTRIES = 100_000; // cap on directory entries VISITED (bounds a repo
// stuffed with millions of non-scannable files/dirs, which never trip MAX_FILES)
const MAX_DEPTH = 40; // cap recursion depth (bounds deeply nested dirs → no stack overflow)

function classify(path: string): FileLanguage {
  const ext = extname(path).toLowerCase();
  const base = path.split(/[\\/]/).pop() ?? '';
  if (base === 'Dockerfile' || base.startsWith('Dockerfile.')) return 'dockerfile';
  switch (ext) {
    case '.js':
    case '.mjs':
    case '.cjs':
    case '.jsx':
      return 'javascript';
    case '.ts':
    case '.tsx':
    case '.mts':
    case '.cts':
      return 'typescript';
    case '.py':
      return 'python';
    case '.sh':
    case '.bash':
    case '.zsh':
      return 'shell';
    case '.json':
      return 'json';
    default:
      return 'other';
  }
}

const SCANNABLE: FileLanguage[] = ['javascript', 'typescript', 'python', 'shell', 'dockerfile', 'json'];

/** Extensions of CODE languages MCP Trust has NO rules for (regex or Semgrep).
 * When a target contains these but no analyzable JS/TS/Python, an "APPROVE / 0
 * findings" would be misleading — the scanner literally could not read the code.
 * We record which such languages were present so the report can say so. */
const UNANALYZED_CODE_EXT: Record<string, string> = {
  '.go': 'Go',
  '.rs': 'Rust',
  '.java': 'Java',
  '.kt': 'Kotlin',
  '.kts': 'Kotlin',
  '.rb': 'Ruby',
  '.php': 'PHP',
  '.cs': 'C#',
  '.c': 'C',
  '.cpp': 'C++',
  '.cc': 'C++',
  '.cxx': 'C++',
  '.hpp': 'C++',
  '.swift': 'Swift',
  '.scala': 'Scala',
  '.ex': 'Elixir',
  '.exs': 'Elixir',
  '.dart': 'Dart',
  '.clj': 'Clojure',
};

export interface DiscoverResult {
  files: DiscoveredFile[];
  /** Sorted names of code languages present but not analyzed (e.g. ['Go']). */
  unanalyzedLanguages: string[];
}

/** Recursively discover and load scannable source files under a directory,
 * recording any code languages present that MCP Trust cannot analyze. */
export function discoverFiles(root: string): DiscoverResult {
  const out: DiscoveredFile[] = [];
  const unanalyzed = new Set<string>();
  let visited = 0; // directory entries examined, scannable or not
  const walk = (dir: string, depth: number) => {
    if (out.length >= MAX_FILES || visited >= MAX_ENTRIES || depth > MAX_DEPTH) return;
    let entries: string[];
    try {
      entries = readdirSync(dir);
    } catch {
      return;
    }
    for (const name of entries) {
      if (out.length >= MAX_FILES || visited >= MAX_ENTRIES) return;
      visited++;
      const full = join(dir, name);
      let st;
      try {
        st = lstatSync(full); // do not follow symlinks out of the workspace
      } catch {
        continue;
      }
      if (st.isSymbolicLink()) continue;
      if (st.isDirectory()) {
        if (SKIP_DIRS.has(name) || name.startsWith('.') && name !== '.cursor' && name !== '.vscode') continue;
        walk(full, depth + 1);
        continue;
      }
      if (!st.isFile() || st.size > MAX_FILE_BYTES) continue;
      const rel = relative(root, full).split(sep).join('/');
      const language = classify(rel);
      if (!SCANNABLE.includes(language)) {
        const unread = UNANALYZED_CODE_EXT[extname(rel).toLowerCase()];
        if (unread) unanalyzed.add(unread);
        continue;
      }
      let content: string;
      try {
        content = readFileSync(full, 'utf8');
      } catch {
        continue;
      }
      out.push({ path: rel, language, content });
    }
  };
  const st = safeStat(root);
  if (st?.isFile()) {
    // Single file target — same byte cap as the walk, to bound memory.
    if (st.size > MAX_FILE_BYTES) return { files: out, unanalyzedLanguages: [] };
    const language = classify(root);
    if (SCANNABLE.includes(language)) {
      try {
        out.push({ path: root.split(sep).pop() ?? root, language, content: readFileSync(root, 'utf8') });
      } catch {
        /* ignore */
      }
    } else {
      const unread = UNANALYZED_CODE_EXT[extname(root).toLowerCase()];
      if (unread) unanalyzed.add(unread);
    }
    return { files: out, unanalyzedLanguages: [...unanalyzed].sort() };
  }
  walk(root, 0);
  return { files: out, unanalyzedLanguages: [...unanalyzed].sort() };
}

function safeStat(p: string) {
  try {
    return statSync(p);
  } catch {
    return null;
  }
}
