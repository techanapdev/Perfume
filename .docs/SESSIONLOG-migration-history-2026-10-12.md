# Session log: migration history reconciliation

Date: 2026-10-12 (Asia/Bangkok)

The user authorized reconciling migration history, creating a PR and merging into dev. The public repository publication scope was explicitly approved earlier.

Remote project: mpzsrprdvvmhormesrva. Readback showed exactly staff_auth (20261010151646) and core_tables (20261011075836). Local and remote SQL matched after stripping line comments and normalizing whitespace; normalized SHA-256 values were a0dba79701e4b7d3c225e76592dfece7a06d51f7d5b9c4b7c96ea6beaf2bd12b and 984793cbe9574df5cc26b2b3d8931980267d16f095988704758669fdb1bcd7c7 respectively.

Renamed the local SQL files to those remote versions without changing their contents. Updated canonical migration guidance and dictionary references. Preserved older session logs as historical evidence. No remote migration repair, schema replay or domain data writes were needed. Added the CLI-generated supabase/.temp directory to .gitignore.

Verification: linked the CLI to the verified project, then supabase db push --linked --dry-run returned Remote database is up to date. pnpm check and pnpm build passed with SWC_NATIVE_BINDING_CACHE=/private/tmp/perfume-core-swc-native. Static/build results do not prove checkout, payments, Customer provisioning or browser behavior.

The user selected Thai for the PR title and description before creation. Commit messages remain English. The user explicitly authorized merging into dev; this structural delivery does not claim browser or business-flow acceptance.
