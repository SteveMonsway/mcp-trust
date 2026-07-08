import { describe, it, expect } from 'vitest';
import { redact, isSecretName, looksLikeSecretValue, sanitizeUntrustedText } from '@mcp-trust/core';

describe('redact', () => {
  it('redacts a GitHub token', () => {
    expect(redact('token=ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')).not.toContain('ghp_ABCDEFGH');
  });
  it('redacts an AWS access key', () => {
    expect(redact('AKIAIOSFODNN7EXAMPLE here')).toContain('<redacted:aws-access-key>');
  });
  it('redacts an Anthropic key', () => {
    expect(redact('sk-ant-abcdefghijklmnopqrstuvwxyz0123')).toContain('<redacted:anthropic-key>');
  });
  it('redacts a full PEM private key block', () => {
    const pem = '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg\n-----END PRIVATE KEY-----';
    expect(redact(pem)).toBe('<redacted:private-key>');
  });
  it('redacts a lone PEM header (no END / body already stripped)', () => {
    expect(redact('JWT_PRIVATE_KEY = """-----BEGIN PRIVATE KEY-----')).not.toContain('BEGIN PRIVATE KEY');
    expect(redact('-----BEGIN RSA PRIVATE KEY-----')).toBe('<redacted:private-key>');
  });
  it('leaves ordinary text intact', () => {
    expect(redact('hello world')).toBe('hello world');
  });
});

describe('sanitizeUntrustedText', () => {
  it('strips ANSI CSI and OSC escape sequences', () => {
    const evil = '\x1b[31mred\x1b[0m\x1b]0;title\x07end';
    const out = sanitizeUntrustedText(evil)!;
    expect(out).not.toContain('\x1b');
    expect(out).toContain('red');
    expect(out).toContain('end');
  });
  it('removes C0/C1 control chars and collapses newlines', () => {
    const out = sanitizeUntrustedText('a\x00b\x07c\nd\re')!;
    // eslint-disable-next-line no-control-regex
    expect(out).not.toMatch(/[\x00-\x1f\x7f-\x9f]/);
    expect(out).not.toContain('\n');
  });
  it('caps length', () => {
    const out = sanitizeUntrustedText('a'.repeat(10_000), 100)!;
    expect(out.length).toBeLessThanOrEqual(101);
  });
  it('passes undefined through', () => {
    expect(sanitizeUntrustedText(undefined)).toBeUndefined();
  });
});

describe('secret helpers', () => {
  it('detects secret-like names', () => {
    expect(isSecretName('GITHUB_TOKEN')).toBe(true);
    expect(isSecretName('AWS_SECRET_ACCESS_KEY')).toBe(true);
    expect(isSecretName('LOG_LEVEL')).toBe(false);
  });
  it('detects secret-like values', () => {
    expect(looksLikeSecretValue('ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')).toBe(true);
    expect(looksLikeSecretValue('info')).toBe(false);
  });
});
