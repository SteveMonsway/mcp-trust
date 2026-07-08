// ---------------------------------------------------------------------------
// Shared domain types for MCP Trust.
// Kept in one module so every package shares a single source of truth.
// ---------------------------------------------------------------------------

// ---- Severity ----

export type Severity = 'info' | 'low' | 'medium' | 'high' | 'critical';

export const SEVERITY_ORDER: Record<Severity, number> = {
  info: 0,
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

/** Numeric weight used when turning a finding into a subscore contribution. */
export const SEVERITY_BASE: Record<Severity, number> = {
  info: 0,
  low: 20,
  medium: 45,
  high: 70,
  critical: 95,
};

// ---- Scan target ----

export type ScanTarget =
  | { type: 'github'; owner: string; repo: string; ref?: string; path?: string; url: string }
  | { type: 'npm'; packageName: string; version?: string }
  | { type: 'pypi'; packageName: string; version?: string }
  | { type: 'docker'; image: string; tag?: string }
  | { type: 'local'; path: string }
  | { type: 'config'; path: string }
  | { type: 'remote-http'; url: string };

export type ScanTargetType = ScanTarget['type'];

// ---- Findings ----

export type FindingCategory =
  | 'config'
  | 'capability'
  | 'metadata'
  | 'code'
  | 'dependency'
  | 'supply_chain'
  | 'auth_transport'
  | 'runtime'
  | 'policy';

export interface Evidence {
  /** Source label, e.g. 'config.command', 'tool.description', 'src/x.ts'. */
  source: string;
  /** Workspace-relative file path, when the evidence comes from a file. */
  file?: string;
  line?: number;
  endLine?: number;
  column?: number;
  /** Redacted snippet of the offending content. */
  snippet?: string;
  /** Redacted matched substring. */
  match?: string;
}

export interface Reference {
  title: string;
  url: string;
}

export interface Finding {
  id: string;
  ruleId: string;
  title: string;
  description: string;
  severity: Severity;
  confidence: number; // 0..1
  category: FindingCategory;
  cwe?: string[];
  capec?: string[];
  owaspLlm?: string[];
  evidence: Evidence[];
  impact: string;
  remediation: string;
  references: Reference[];
  tags: string[];
  firstSeen?: string;
  fingerprint: string;
}

/** Decision-override tags that rules may attach to a finding. */
export const TAG_FORCE_BLOCK = 'force_block';
export const TAG_MIN_NEEDS_REVIEW = 'min_needs_review';

/** Tag marking a finding produced by the Semgrep engine (vs the regex rules). */
export const TAG_ENGINE_SEMGREP = 'engine:semgrep';

/**
 * A Semgrep match normalized by the static-scanner from the raw JSON output.
 * All descriptive fields (title/severity/remediation/…) come from the bundled
 * ruleset's `mcp_*` metadata — the single source of truth. `file`/`snippet`
 * originate from the (untrusted) target; the converter redacts/sanitizes them.
 */
export interface SemgrepNormalizedFinding {
  /** Raw semgrep check_id (namespaced path), kept for diagnostics. */
  checkId: string;
  /** Authoritative rule id from metadata.mcp_id (e.g. MCP-SG-JS-001). */
  mcpId: string;
  title: string;
  category: string;
  severity: string;
  confidence: number;
  capability?: string;
  impact: string;
  remediation: string;
  cwe?: string;
  minNeedsReview: boolean;
  references: string[];
  /** Target-relative file path (untrusted). */
  file: string;
  line: number;
  column: number;
  endLine?: number;
  /** Source line text, filled by the pipeline from discovered file content. */
  snippet?: string;
}

// ---- Capability map ----

export type CapabilityCategory =
  | 'filesystem_read'
  | 'filesystem_write'
  | 'filesystem_delete'
  | 'shell_execution'
  | 'network_egress'
  | 'credential_access'
  | 'browser_access'
  | 'email_access'
  | 'document_access'
  | 'database_access'
  | 'destructive_action'
  | 'deployment_action'
  | 'repository_write'
  | 'payment_or_transfer'
  | 'user_impersonation'
  | 'unknown_high_privilege';

export interface InferredCapability {
  category: CapabilityCategory;
  confidence: number; // 0..1
  evidence: Evidence[];
}

export interface McpToolSummary {
  name: string;
  title?: string;
  description?: string;
  inputSchema?: unknown;
  riskTags: string[];
  inferredCapabilities: InferredCapability[];
}

export interface McpResourceSummary {
  uri?: string;
  name?: string;
  description?: string;
}

export interface McpPromptSummary {
  name: string;
  description?: string;
  text?: string;
}

export type CapabilitySource = 'introspection' | 'static_inference' | 'none';

export interface CapabilityMap {
  source: CapabilitySource;
  protocolVersion?: string;
  serverInfo?: { name?: string; version?: string };
  tools: McpToolSummary[];
  resources: McpResourceSummary[];
  prompts: McpPromptSummary[];
  serverCapabilities?: Record<string, unknown>;
  /** Capabilities inferred statically from code/config when no per-tool list
   * is available (i.e. no runtime introspection). */
  aggregateCapabilities: InferredCapability[];
}

/** All inferred capabilities across per-tool summaries plus the aggregate. */
export function allInferredCapabilities(map: CapabilityMap | undefined): InferredCapability[] {
  if (!map) return [];
  const out: InferredCapability[] = [...map.aggregateCapabilities];
  for (const tool of map.tools) out.push(...tool.inferredCapabilities);
  return out;
}

// ---- Parsed MCP config (produced by config-scanner) ----

export interface ParsedMcpServer {
  /** Server key in the config file (e.g. "filesystem"). */
  name: string;
  command?: string;
  args: string[];
  env: Record<string, string>;
  cwd?: string;
  url?: string;
  headers: Record<string, string>;
  transport: 'stdio' | 'http' | 'unknown';
  /** Raw JSON path within the config file, for evidence. */
  configFile: string;
}

// ---- Discovered source file (produced by resolvers / static-scanner) ----

export type FileLanguage = 'javascript' | 'typescript' | 'python' | 'shell' | 'dockerfile' | 'json' | 'other';

export interface DiscoveredFile {
  /** Workspace-relative path. */
  path: string;
  language: FileLanguage;
  content: string;
}

// ---- Package / repo metadata (produced by resolvers) ----

export interface PackageMetadata {
  name?: string;
  version?: string;
  repositoryUrl?: string;
  homepage?: string;
  license?: string;
  hasLockfile?: boolean;
  installScripts?: { name: string; value: string }[];
  /** True when the declared repo URL does not match the resolved source. */
  repoMismatch?: boolean;
  hasSecurityPolicy?: boolean;
}

// ---- Resolved target ----

export interface ResolvedTarget {
  target: ScanTarget;
  /** Absolute path to the extracted/cloned workspace, if any. */
  sourceDir?: string;
  metadata?: PackageMetadata;
  resolvedRef?: string;
}

// ---- Coverage (what actually ran) ----

export type CoverageState =
  | 'completed'
  | 'partial'
  | 'not_available'
  | 'skipped'
  | 'disabled';

export interface Coverage {
  configScan: CoverageState;
  staticScan: CoverageState;
  capabilityInference: 'static_only' | 'mcp_runtime_metadata' | 'none';
  introspection:
    | CoverageState
    | 'skipped_real_target_no_sandbox'
    | 'completed_trusted_fixture'
    | 'completed_sandboxed'
    | 'failed'
    | 'failed_sandbox_unavailable';
  semgrep: CoverageState;
  docker: CoverageState;
  dependencyScan: CoverageState;
  runtimeScan: CoverageState;
  packageMetadata: CoverageState;
}

// ---- Scan options & context ----

export type OutputFormat = 'console' | 'json' | 'md' | 'html' | 'sarif';

/** How introspection executes the server process. 'none' = direct host process
 * (Level 1, trusted fixtures only). 'docker' = isolated container (Level 2). */
export type SandboxKind = 'none' | 'docker';

export interface ScanOptions {
  formats: OutputFormat[];
  outputDir?: string;
  failOn: Severity;
  noExec: boolean;
  introspect: boolean;
  timeoutMs: number;
  policyPath?: string;
  /** Sandbox mode for introspection. Default 'none'. */
  sandbox: SandboxKind;
  /** Run the bundled Semgrep ruleset over source when semgrep is available.
   * Default true; set false via --no-semgrep. */
  semgrep?: boolean;
  /** Explicit server command override for introspection (e.g. 'node'). */
  mcpCommand?: string;
  /** Explicit server args override for introspection (e.g. ['server.js']). */
  mcpArgs?: string[];
}

export interface ScanLogEvent {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  at: string;
}

export interface ScanContext {
  target: ScanTarget;
  workspaceDir: string;
  startedAt: string;
  options: ScanOptions;
  resolved?: ResolvedTarget;
  configs: ParsedMcpServer[];
  files: DiscoveredFile[];
  capabilityMap?: CapabilityMap;
  /** Set by the pipeline when introspection ran (or was attempted). */
  runtimeIntrospection?: RuntimeIntrospection;
  metadata?: PackageMetadata;
  /** Honest caveats surfaced into the final report (see ScanResult.limitations). */
  limitations?: string[];
  coverage: Coverage;
  logs: ScanLogEvent[];
}

// ---- Rules ----

export type RuleInputKind = 'config' | 'code-js' | 'code-python' | 'mcp-metadata' | 'package-metadata';

export interface Rule {
  id: string;
  title: string;
  description: string;
  defaultSeverity: Severity;
  category: FindingCategory;
  tags: string[];
  appliesTo: RuleInputKind[];
  remediation: string;
  references?: Reference[];
  falsePositiveNotes?: string;
  evaluate(ctx: ScanContext): Finding[] | Promise<Finding[]>;
}

// ---- Scoring & decision ----

export type Decision = 'APPROVE' | 'APPROVE_WITH_RESTRICTIONS' | 'NEEDS_REVIEW' | 'BLOCK';
export type RiskBand = 'low' | 'medium' | 'high' | 'critical';

export interface Subscores {
  config: number | null;
  capability: number | null;
  metadata: number | null;
  code: number | null;
  dependency: number | null;
  supplyChain: number | null;
  authTransport: number | null;
  runtime: number | null;
  maintainer: number | null;
}

export interface RiskScore {
  overall: number; // 0..100
  risk: RiskBand;
  confidence: number; // 0..1
  decision: Decision;
  decisionReason: string[];
  subscores: Subscores;
}

// ---- Final scan result ----

export interface ScanSummary {
  overallScore: number;
  risk: RiskBand;
  decision: Decision;
  confidence: number;
  topReasons: string[];
}

// ---- Runtime introspection (produced when the server was actually run) ----

export type RuntimeIntrospectionStatus =
  | 'completed_sandboxed'
  | 'completed_trusted_fixture'
  | 'failed'
  | 'failed_sandbox_unavailable'
  | 'skipped';

export interface RuntimeSandboxInfo {
  kind: 'docker';
  image: string;
  network: 'none' | 'default';
  readOnlyRootFilesystem: boolean;
}

export interface RuntimeIntrospection {
  status: RuntimeIntrospectionStatus;
  transport: 'stdio';
  /** Introspection client implementation, e.g. '@modelcontextprotocol/sdk'. */
  client: string;
  sandbox?: RuntimeSandboxInfo;
  toolsDiscovered: number;
  resourcesDiscovered: number;
  promptsDiscovered: number;
}

export interface ScanResult {
  schemaVersion: string;
  scanner: { name: string; version: string };
  target: ScanTarget;
  /** Stable human/machine locator for the target (TZ §9.1 compatibility). */
  locator: string;
  resolvedRef?: string;
  resolvedCommit?: string;
  /** Flat summary block for API consumers (TZ §9.1). */
  summary: ScanSummary;
  score: RiskScore;
  capabilityMap?: CapabilityMap;
  /** Present when introspection ran (or was attempted and failed). */
  runtimeIntrospection?: RuntimeIntrospection;
  findings: Finding[];
  recommendedPolicy: string[];
  /** Honest caveats about what could NOT be assessed (e.g. code in a language
   * MCP Trust has no rules for). Present only when there is something to warn
   * about, so an APPROVE/0-findings result is not misread as a clean bill. */
  limitations?: string[];
  coverage: Coverage;
  generatedAt: string;
  disclaimer: string;
}
