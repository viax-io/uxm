// Barrel for internal helpers. Consumers should not depend on this path —
// it lives at `dist/helpers/` only as a build artefact of bundle:false mode
// and is intentionally absent from `package.json#exports`.
export * from './cn';
export * from './merge-described-by';
export * from './merge-refs';
