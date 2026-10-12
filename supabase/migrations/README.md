# Migrations

`staff_auth` and the six-table thin Core are applied to `mpzsrprdvvmhormesrva`. Core passed independent scrutiny before the user-authorized apply; see [ADR 0004](../../docs/adr/0004-core-table-integration.md) and the [actual-column dictionary](../../docs/perfume/data-dictionary.md).

Extend the Core tables in later feature migrations; do not create them again. Core does not include business prices/statuses/snapshots or public access policies. The full DBML is a feature proposal, not the installed schema.

History reconciled on 2026-10-12: local filenames now match the two actual remote versions, `20261010151646_staff_auth.sql` and `20261011075836_core_tables.sql`. Both files' SQL matches the recorded remote statements after removing comments and normalizing whitespace. Only filenames changed; no remote history repair, SQL replay or data changes were needed.

Before future remote pushes, verify the linked project is `mpzsrprdvvmhormesrva` and inspect `supabase db push --linked --dry-run`. Reconciliation does not approve unrelated pending migrations. Core schema assertions and anonymous REST denials passed in the implementation session; no domain rows were created during verification.

Read [DB design and approval gates](../../docs/perfume/db.md) before creating schema.
Feature owners write their migrations; coordinate sequencing with Member 3 and a named reviewer; use unique CLI-generated timestamps, review constraints/RLS/grants, and generate Database types from the real schema.
Do not apply migrations to any remote database without explicit authorization.
