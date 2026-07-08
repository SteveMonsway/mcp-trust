/** Split a command string into tokens, honoring single/double quotes. */
export function tokenizeCommand(input: string): string[] {
  const tokens: string[] = [];
  let cur = '';
  let quote = '';
  let has = false;
  for (let i = 0; i < input.length; i++) {
    const c = input[i]!;
    if (quote) {
      if (c === quote) quote = '';
      else cur += c;
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
      has = true;
      continue;
    }
    if (/\s/.test(c)) {
      if (has || cur) {
        tokens.push(cur);
        cur = '';
        has = false;
      }
      continue;
    }
    cur += c;
    has = true;
  }
  if (has || cur) tokens.push(cur);
  return tokens;
}
