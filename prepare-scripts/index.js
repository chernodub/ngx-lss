// The script orchestrates package syncing scripts.
// It is used to simplify the release process and preserve a single source of truth for the whole project.
// TODO: figure out a more "canonical" way to sync packages without relying on an external monorepo tooling.

require('./sync-lib-package');
require('./sync-lib-readme');
