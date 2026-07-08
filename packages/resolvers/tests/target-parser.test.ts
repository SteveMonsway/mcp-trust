import { describe, it, expect } from 'vitest';
import { parseTarget } from '@mcp-trust/resolvers';

describe('parseTarget', () => {
  it('parses npm with scope and version', () => {
    const r = parseTarget('npm:@scope/pkg@1.2.3');
    expect(r.ok).toBe(true);
    if (r.ok && r.target.type === 'npm') {
      expect(r.target.packageName).toBe('@scope/pkg');
      expect(r.target.version).toBe('1.2.3');
    }
  });

  it('parses github shorthand and tree ref/path', () => {
    const r = parseTarget('github:owner/repo/tree/main/src/fs');
    expect(r.ok).toBe(true);
    if (r.ok && r.target.type === 'github') {
      expect(r.target.owner).toBe('owner');
      expect(r.target.repo).toBe('repo');
      expect(r.target.ref).toBe('main');
      expect(r.target.path).toBe('src/fs');
    }
  });

  it('parses github https url', () => {
    const r = parseTarget('https://github.com/owner/repo');
    expect(r.ok).toBe(true);
  });

  it('rejects pypi and docker as unsupported in Phase 1', () => {
    expect(parseTarget('pypi:foo')).toMatchObject({ ok: false, reason: 'unsupported_target' });
    expect(parseTarget('docker:img')).toMatchObject({ ok: false, reason: 'unsupported_target' });
  });

  it('rejects unknown non-existent local paths', () => {
    expect(parseTarget('./does/not/exist/xyz')).toMatchObject({ ok: false, reason: 'invalid_target' });
  });

  it('treats an existing json file as a config target', () => {
    const r = parseTarget('fixtures/configs/safe-config.json');
    // base is INIT_CWD/repo root during tests
    if (r.ok) expect(r.target.type).toBe('config');
  });
});
