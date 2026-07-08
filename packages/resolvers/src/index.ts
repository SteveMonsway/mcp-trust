export { parseTarget, type ParseResult } from './target-parser.js';
export { resolve } from './resolve.js';
export { resolveDirectory } from './local-resolver.js';
export { safeScanRoot } from './github-resolver.js';
export { readCappedJson } from './npm-resolver.js';
export { metadataFromPackageJson, metadataFromDir } from './metadata.js';
export { type ResolveOutput, type ConfigFileContent } from './types.js';
