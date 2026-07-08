/**
 * Tolerant JSON parser for MCP configs which are often JSONC (Cursor/VS Code):
 * strips // and /* *\/ comments and trailing commas, then JSON.parse.
 * Returns null on failure rather than throwing.
 */
export function parseJsonc(text: string): unknown | null {
  try {
    return JSON.parse(text);
  } catch {
    // fall through to tolerant parse
  }
  try {
    return JSON.parse(stripJsonc(text));
  } catch {
    return null;
  }
}

function stripJsonc(input: string): string {
  let out = '';
  let inString = false;
  let quote = '';
  let inLine = false;
  let inBlock = false;
  for (let i = 0; i < input.length; i++) {
    const c = input[i]!;
    const next = input[i + 1];
    if (inLine) {
      if (c === '\n') {
        inLine = false;
        out += c;
      }
      continue;
    }
    if (inBlock) {
      if (c === '*' && next === '/') {
        inBlock = false;
        i++;
      }
      continue;
    }
    if (inString) {
      out += c;
      if (c === '\\') {
        out += next ?? '';
        i++;
        continue;
      }
      if (c === quote) inString = false;
      continue;
    }
    if (c === '"' || c === "'") {
      inString = true;
      quote = c;
      out += c;
      continue;
    }
    if (c === '/' && next === '/') {
      inLine = true;
      i++;
      continue;
    }
    if (c === '/' && next === '*') {
      inBlock = true;
      i++;
      continue;
    }
    out += c;
  }
  // remove trailing commas before } or ]
  return out.replace(/,(\s*[}\]])/g, '$1');
}
