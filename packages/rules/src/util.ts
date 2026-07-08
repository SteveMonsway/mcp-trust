import type { DiscoveredFile, Evidence, ScanContext } from '@mcp-trust/core';

export interface LineMatch {
  line: number;
  column: number;
  text: string;
  match: string;
}

/** Find every match of a (global) regex, with 1-based line/column and line text. */
export function findLineMatches(content: string, regex: RegExp): LineMatch[] {
  const re = regex.global ? regex : new RegExp(regex.source, regex.flags + 'g');
  const lines = content.split(/\r?\n/);
  const out: LineMatch[] = [];
  // Precompute cumulative offsets per line start.
  const lineStart: number[] = [];
  let acc = 0;
  for (const l of lines) {
    lineStart.push(acc);
    acc += l.length + 1;
  }
  let m: RegExpExecArray | null;
  re.lastIndex = 0;
  while ((m = re.exec(content)) !== null) {
    const idx = m.index;
    let lineNo = lineStart.findIndex((start, i) => idx < (lineStart[i + 1] ?? Infinity));
    if (lineNo < 0) lineNo = lines.length - 1;
    const col = idx - (lineStart[lineNo] ?? 0) + 1;
    out.push({
      line: lineNo + 1,
      column: col,
      text: (lines[lineNo] ?? '').trim().slice(0, 200),
      match: m[0],
    });
    if (m.index === re.lastIndex) re.lastIndex++; // avoid zero-width loop
  }
  return out;
}

export function jsFiles(ctx: ScanContext): DiscoveredFile[] {
  return ctx.files.filter((f) => f.language === 'javascript' || f.language === 'typescript');
}

export function pythonFiles(ctx: ScanContext): DiscoveredFile[] {
  return ctx.files.filter((f) => f.language === 'python');
}

/** Text sources scanned for metadata/poisoning (tool metadata + code + docs). */
export interface TextChunk {
  source: string;
  file?: string;
  value: string;
  line?: number;
}

export function metadataTextChunks(ctx: ScanContext): TextChunk[] {
  const chunks: TextChunk[] = [];
  const map = ctx.capabilityMap;
  if (map) {
    for (const t of map.tools) {
      if (t.description) chunks.push({ source: `tool.description:${t.name}`, value: t.description });
      if (t.title) chunks.push({ source: `tool.title:${t.name}`, value: t.title });
      chunks.push({ source: `tool.name`, value: t.name });
    }
    for (const p of map.prompts) {
      if (p.text) chunks.push({ source: `prompt.text:${p.name}`, value: p.text });
      if (p.description) chunks.push({ source: `prompt.description:${p.name}`, value: p.description });
    }
    for (const r of map.resources) {
      if (r.uri) chunks.push({ source: `resource.uri:${r.name ?? ''}`, value: r.uri });
      if (r.description) chunks.push({ source: `resource.description`, value: r.description });
    }
  }
  // Also scan STRING LITERALS in source files (where tool descriptions live),
  // NOT raw file content — scanning comments/prose causes false positives.
  for (const f of ctx.files) {
    if (f.language === 'json' || f.language === 'other') continue;
    for (const lit of extractStringLiterals(f.content)) {
      chunks.push({ source: f.path, file: f.path, value: lit });
    }
  }
  return chunks;
}

/** Extract quoted string-literal contents from source code (JS/TS/Python). */
export function extractStringLiterals(content: string): string[] {
  const out: string[] = [];
  // Matches '...', "...", `...`, and Python triple-quoted strings.
  const re = /"""([\s\S]*?)"""|'''([\s\S]*?)'''|`((?:\\.|[^`\\])*)`|"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)'/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    const value = m[1] ?? m[2] ?? m[3] ?? m[4] ?? m[5] ?? '';
    if (value.length >= 4) out.push(value);
    if (m.index === re.lastIndex) re.lastIndex++;
  }
  return out;
}

export function evidenceFromChunk(chunk: TextChunk, match: string): Evidence {
  return {
    source: chunk.source,
    file: chunk.file,
    match,
    snippet: chunk.value.slice(0, 200),
  };
}
