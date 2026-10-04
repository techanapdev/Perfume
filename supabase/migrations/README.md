# Migrations

No SQL migrations are implemented or applied in this foundation.

Read [DB design and approval gates](../../docs/perfume/db.md) before creating schema.
Feature owners write their migrations; coordinate sequencing with Member 3 and a named reviewer; use unique CLI-generated timestamps, review constraints/RLS/grants, and generate Database types from the real schema.
Do not apply migrations to any remote database without explicit authorization.
