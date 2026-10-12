# Migrations

`staff_auth` and the six-table thin Core are applied to `mpzsrprdvvmhormesrva`. Core passed independent scrutiny before the user-authorized apply; see [ADR 0004](../../docs/adr/0004-core-table-integration.md) and the [actual-column dictionary](../../docs/perfume/data-dictionary.md).

Extend the Core tables in later feature migrations; do not create them again. Core does not include business prices/statuses/snapshots or public access policies. The full DBML is a feature proposal, not the installed schema.

The existing local staff filename uses `20261010000000`, while its actual remote migration version is `20261010151646`. Do not use a bulk `db push` without reconciling history under a separately reviewed plan. Core is applied as the exact reviewed file through MCP; record the returned remote version in the session log.

Core local file: `20261011075113_core_tables.sql`; actual MCP remote version: `20261011075836`. Schema assertions and anonymous REST denials passed. Do not replay either existing migration or repair remote history automatically; reconcile local/remote timestamps before a later CLI push. No domain rows were created during verification.

Read [DB design and approval gates](../../docs/perfume/db.md) before creating schema.
Feature owners write their migrations; coordinate sequencing with Member 3 and a named reviewer; use unique CLI-generated timestamps, review constraints/RLS/grants, and generate Database types from the real schema.
Do not apply migrations to any remote database without explicit authorization.
