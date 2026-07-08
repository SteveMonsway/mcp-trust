import type { CapabilityCategory, Evidence, InferredCapability, Severity } from '@mcp-trust/core';

export interface CapabilityDefinition {
  category: CapabilityCategory;
  severityBaseline: Severity;
  /** Substrings (case-insensitive) that hint at this capability. */
  keywords: string[];
  /** Regexes that more strongly indicate this capability. */
  regex: RegExp[];
  falsePositiveNotes: string;
}

// Deterministic capability dictionary. Keywords give weak signal (0.6),
// regex hits give strong signal (0.82). No LLM involved.
export const CAPABILITY_DEFINITIONS: CapabilityDefinition[] = [
  {
    category: 'filesystem_read',
    severityBaseline: 'high',
    keywords: ['read file', 'read_file', 'readfile', 'load file', 'get file', 'list directory', 'list_directory', 'read directory'],
    regex: [/read[_\s-]?file/i, /\bfs\.read/i, /list[_\s-]?dir/i, /open\s+file/i],
    falsePositiveNotes: 'A tool that reads a single fixed config file is lower risk than an arbitrary path reader.',
  },
  {
    category: 'filesystem_write',
    severityBaseline: 'high',
    keywords: ['write file', 'write_file', 'writefile', 'save file', 'create file', 'edit file', 'append file'],
    regex: [/write[_\s-]?file/i, /\bfs\.write/i, /save\s+to\s+disk/i, /edit[_\s-]?file/i],
    falsePositiveNotes: 'Writing inside a scoped workspace is expected for many editors.',
  },
  {
    category: 'filesystem_delete',
    severityBaseline: 'high',
    keywords: ['delete file', 'delete_file', 'remove file', 'unlink', 'rmdir', 'delete directory'],
    regex: [/delete[_\s-]?file/i, /remove[_\s-]?file/i, /\brm\s+-rf\b/i, /unlink/i],
    falsePositiveNotes: 'Deletion scoped to temp dirs is lower risk.',
  },
  {
    category: 'shell_execution',
    severityBaseline: 'critical',
    keywords: ['execute command', 'run command', 'run shell', 'shell command', 'terminal', 'bash', 'powershell', 'exec command'],
    regex: [/exec(?:ute)?[_\s-]?command/i, /run[_\s-]?shell/i, /child_process/i, /subprocess/i, /\bshell\b/i],
    falsePositiveNotes: 'Word "shell" can appear in unrelated docs; require an execution verb nearby.',
  },
  {
    category: 'network_egress',
    severityBaseline: 'medium',
    keywords: ['fetch url', 'http request', 'download', 'web request', 'call api', 'send request', 'outbound'],
    regex: [/fetch[_\s-]?url/i, /http[_\s-]?request/i, /make.{0,200}request/i, /web[_\s-]?fetch/i],
    falsePositiveNotes: 'Fetching a fixed vendor API is lower risk than arbitrary-URL fetch.',
  },
  {
    category: 'credential_access',
    severityBaseline: 'high',
    keywords: ['read secret', 'access token', 'credentials', 'api key', 'keychain', 'password', 'private key', 'ssh key'],
    regex: [/\bsecret/i, /access[_\s-]?token/i, /credential/i, /\bkeychain\b/i, /\.ssh\b/i, /\benv\b.*(key|token|secret)/i],
    falsePositiveNotes: 'A tool may mention credentials in docs without accessing them.',
  },
  {
    category: 'email_access',
    severityBaseline: 'high',
    keywords: ['send email', 'read email', 'gmail', 'smtp', 'imap', 'mailbox', 'inbox'],
    regex: [/send[_\s-]?email/i, /read[_\s-]?email/i, /\bsmtp\b/i, /\bimap\b/i, /\bgmail\b/i],
    falsePositiveNotes: '',
  },
  {
    category: 'database_access',
    severityBaseline: 'high',
    keywords: ['sql query', 'run query', 'execute query', 'database', 'postgres', 'mysql', 'mongodb', 'select from', 'insert into'],
    regex: [/execute[_\s-]?query/i, /run[_\s-]?query/i, /\bsql\b/i, /postgres|mysql|sqlite|mongo/i],
    falsePositiveNotes: 'Read-only query tools are lower risk than write/DDL tools.',
  },
  {
    category: 'browser_access',
    severityBaseline: 'high',
    keywords: ['browser', 'puppeteer', 'playwright', 'navigate to', 'cookie', 'session', 'screenshot'],
    regex: [/puppeteer|playwright/i, /browser[_\s-]?automation/i, /\bcookie/i, /navigate[_\s-]?to/i],
    falsePositiveNotes: '',
  },
  {
    category: 'repository_write',
    severityBaseline: 'high',
    keywords: ['git push', 'git commit', 'merge', 'rebase', 'create pull request', 'force push', 'delete branch'],
    regex: [/git[_\s-]?push/i, /force[_\s-]?push/i, /create[_\s-]?(pull|merge)[_\s-]?request/i, /\brebase\b/i],
    falsePositiveNotes: 'Read-only git tools do not qualify.',
  },
  {
    category: 'deployment_action',
    severityBaseline: 'high',
    keywords: ['deploy', 'terraform apply', 'kubectl apply', 'provision', 'infrastructure', 'cloudformation'],
    regex: [/\bdeploy\b/i, /terraform[_\s-]?apply/i, /kubectl[_\s-]?apply/i, /provision/i],
    falsePositiveNotes: '',
  },
  {
    category: 'payment_or_transfer',
    severityBaseline: 'critical',
    keywords: ['payment', 'charge card', 'transfer funds', 'stripe charge', 'refund', 'send money', 'checkout'],
    regex: [/charge[_\s-]?card/i, /transfer[_\s-]?funds/i, /create[_\s-]?charge/i, /\brefund\b/i, /send[_\s-]?money/i],
    falsePositiveNotes: '',
  },
  {
    category: 'destructive_action',
    severityBaseline: 'high',
    keywords: ['drop table', 'truncate', 'wipe', 'destroy', 'purge', 'reset all'],
    regex: [/drop[_\s-]?table/i, /truncate/i, /\bwipe\b/i, /destroy[_\s-]?all/i, /\bpurge\b/i],
    falsePositiveNotes: '',
  },
];

export interface TextSource {
  /** Evidence source label. */
  source: string;
  value: string;
  file?: string;
}

/** Infer capabilities from a set of textual sources (tool name/desc/schema keys). */
export function inferCapabilities(sources: TextSource[]): InferredCapability[] {
  const byCategory = new Map<CapabilityCategory, InferredCapability>();

  for (const def of CAPABILITY_DEFINITIONS) {
    for (const src of sources) {
      const text = src.value;
      if (!text) continue;
      let confidence = 0;
      let match: string | undefined;

      for (const re of def.regex) {
        re.lastIndex = 0;
        const m = re.exec(text);
        if (m) {
          confidence = Math.max(confidence, 0.82);
          match = m[0];
          break;
        }
      }
      if (confidence === 0) {
        const lower = text.toLowerCase();
        const kw = def.keywords.find((k) => lower.includes(k));
        if (kw) {
          confidence = 0.6;
          match = kw;
        }
      }
      if (confidence === 0) continue;

      const evidence: Evidence = { source: src.source, file: src.file, match, snippet: text.slice(0, 200) };
      const existing = byCategory.get(def.category);
      if (!existing) {
        byCategory.set(def.category, { category: def.category, confidence, evidence: [evidence] });
      } else {
        existing.confidence = Math.max(existing.confidence, confidence);
        existing.evidence.push(evidence);
      }
    }
  }

  return [...byCategory.values()];
}

export function severityForCapability(category: CapabilityCategory): Severity {
  return CAPABILITY_DEFINITIONS.find((d) => d.category === category)?.severityBaseline ?? 'medium';
}
