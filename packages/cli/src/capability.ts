import { redact, type CapabilityMap, type ScanContext } from '@mcp-trust/core';
import { inferCapabilities, type TextSource } from '@mcp-trust/rules';

const red = (s: string | undefined): string | undefined => (s == null ? s : redact(s));

/** Redact secret-shaped text in server-controlled metadata before it is used
 * for inference or serialized into a report. */
export function redactCapabilityMap(map: CapabilityMap): CapabilityMap {
  for (const t of map.tools) {
    t.description = red(t.description);
    t.title = red(t.title);
  }
  for (const r of map.resources) {
    r.description = red(r.description);
    r.uri = red(r.uri);
  }
  for (const p of map.prompts) {
    p.description = red(p.description);
    p.text = red(p.text);
  }
  return map;
}

/** Collect property names from a JSON-schema-like object (bounded depth). */
function schemaKeys(schema: unknown, depth = 0, acc: string[] = []): string[] {
  if (depth > 4 || !schema || typeof schema !== 'object') return acc;
  const o = schema as Record<string, unknown>;
  const props = o.properties;
  if (props && typeof props === 'object') {
    for (const [key, val] of Object.entries(props as Record<string, unknown>)) {
      acc.push(key);
      schemaKeys(val, depth + 1, acc);
    }
  }
  if (o.items) schemaKeys(o.items, depth + 1, acc);
  return acc;
}

/** Enrich an introspected map with per-tool inferred capabilities. */
export function enrichIntrospectedMap(map: CapabilityMap): CapabilityMap {
  for (const tool of map.tools) {
    const sources: TextSource[] = [{ source: 'tool.name', value: tool.name }];
    if (tool.title) sources.push({ source: 'tool.title', value: tool.title });
    if (tool.description) sources.push({ source: `tool.description:${tool.name}`, value: tool.description });
    for (const key of schemaKeys(tool.inputSchema)) sources.push({ source: 'tool.schema', value: key });
    const caps = inferCapabilities(sources);
    tool.inferredCapabilities = caps;
    tool.riskTags = [...new Set(caps.map((c) => c.category))];
  }
  return map;
}

/** Build a static capability map from configs + package metadata (no execution). */
export function buildStaticCapabilityMap(ctx: ScanContext): CapabilityMap {
  const sources: TextSource[] = [];
  for (const s of ctx.configs) {
    sources.push({ source: `config.server:${s.name}`, value: redact(s.name) });
    sources.push({ source: `config.command:${s.name}`, value: redact([s.command ?? '', ...s.args].join(' ')) });
  }
  if (ctx.metadata?.name) sources.push({ source: 'package.name', value: redact(ctx.metadata.name) });
  const aggregate = inferCapabilities(sources);
  return {
    source: 'static_inference',
    tools: [],
    resources: [],
    prompts: [],
    aggregateCapabilities: aggregate,
  };
}
