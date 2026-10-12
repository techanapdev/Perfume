# Core table integration plan

Date: 2026-10-11
Decision: [ADR 0004](../adr/0004-core-table-integration.md)

## Scope

Install one six-table identity/FK spine in verified Supabase project `mpzsrprdvvmhormesrva`, after independent scrutiny passes. Preserve existing staff/Auth data and functions. Deliver an actual-column dictionary and generated public Database types; do not implement business feature operations or send documents externally.

## Steps

1. Verify local env URL, remote project/version, migration history, target-name conflicts and existing staff baseline. Completed: PostgreSQL 17.11, public Core absent, staff count one.
2. Prepare CLI-generated Core migration, ADR and dictionary. Reconcile proposal ID types and member-only scope; retain feature proposals and archived documents.
3. Independent reviewer traces migration/access/deletion and dictionary; fix blockers and obtain concrete SQL PASS.
4. Recheck target conflicts, apply the exact reviewed migration once through MCP, then record the actual remote migration version. No full `db push`: existing staff local timestamp differs from remote history.
5. Dump live columns/constraints/indexes/RLS/grants, compare against reviewed SQL and run `scripts/core-schema.check.sql`. Confirm unchanged staff count/function. Check anonymous REST reads are denied without customer/payment writes.
6. Generate types from live public schema into `src/shared/lib/supabase/database.types.ts`. Record provider-generated output, do not hand-edit it or wire feature clients before domain queries exist.
7. Update installed status, verification evidence and owner extension instructions in dictionary/session log. Run static/build checks as appropriate for generated TypeScript; no browser feature acceptance is claimed.

## Recovery and boundaries

Six new tables must be absent before apply; fail on conflicts rather than mask them with `IF NOT EXISTS`. SQL apply must be atomic through the migration tool. On partial/unexpected state, stop and inspect migration history/catalog before retrying. No automatic down migration or deletion: after feature owners extend/use Core, dropping it can destroy data and requires separate authorization. RLS/grants remain closed until reviewed feature migrations enable access.

No UUIDv7 dependency, no generic CRUD, no status/provider/tax/Custom defaults, no production fixtures, no commit/push/deploy. Read-only SQL catalog and denied HTTP checks establish structural/access proof, not successful Checkout/Payment or business lifecycle acceptance.
