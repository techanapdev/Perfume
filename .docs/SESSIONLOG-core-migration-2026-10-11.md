# Session log: shared Core migration and team dictionary

Date: 2026-10-11 (Asia/Bangkok)
Repository: `/Users/arty/Desktop/Techanap/Projects/Perfume`
Branch: `main`; no commits, pushes, deployment or external sends.

## Outcome

One six-table structural Core migration passed independent agent scrutiny and was applied to verified Supabase project `mpzsrprdvvmhormesrva`. The actual schema matches the reviewed SQL. The team dictionary distinguishes installed Core columns from future feature proposals. Existing staff records and authorization function are unchanged.

## Authorization and decisions

The user explicitly instructed: send to an agent for scrutiny, apply if it passes, and write a dictionary for the team. The user previously confirmed Catalog bigint IDs, UUIDs elsewhere, member-only purchase, Product-to-many-Variants and preservation of Order/Payment history when members or catalog records are deleted. Custom sellable identity and Payment retry policies were delegated to owners.

The independent plan review recommended a thinner schema than the old DBML: keys, relationships and creation timestamps only. The concrete migration received PASS / ship before remote apply. Nullable Item Variant linkage is structural capacity pending Custom design, not approval to accept invalid standard purchases.

Final independent delivery audit after apply: PASS, no blockers. Reviewer inspected saved remote statements/schema evidence, generated types, dictionary and session log; it did not rerun remote queries. Local delivery assertions also passed 16 artifact links, dictionary coverage of all 18 live columns and both proposal diagrams' 26 tables/29 references with Catalog bigint/Auth linkage consistency (structural checks, not fresh parser execution).

## Artifacts and scope

- `supabase/migrations/20261011075113_core_tables.sql`: CLI-generated local filename; reviewed SHA-256 `182c751657fb7fa2a440bcf0176e6b3603ce860f7c0d1f4b94ad7df699eac210`.
- `docs/adr/0004-core-table-integration.md`: accepted Core boundary, alternatives, deletion/access limits.
- `docs/perfume/plan-core-tables.md`: preflight, apply, verification and recovery boundary.
- `docs/perfume/data-dictionary.md`: all 18 installed Core columns, existing Staff columns, owner responsibilities, use cases, access limitations and Proposed feature appendix.
- `docs/perfume/db-integration-outline.md`, `db.md`, `db-open-questions.md` and both DBMLs: reconcile approved IDs/member-only scope with retained proposals.
- `src/shared/lib/supabase/database.types.ts`: provider-generated live public schema types; formatting only, no hand-edited model or client wiring.
- `scripts/core-schema.check.sql`: rerunnable read-only catalog assertions for initial baseline; rejects disabled PL/pgSQL assertions.
- `.docs/core-schema-2026-10-11.json`: live columns, constraints, indexes, RLS/ACLs, empty row counts and staff baseline.
- `.docs/core-migration-remote-2026-10-11.json`: actual remote migration statements/version; normalized statements match reviewed SQL (comments/whitespace ignored).

Six new public tables: `customers`, `products`, `product_variants`, `orders`, `order_items`, `payments`. All have only IDs/FKs/created_at. Existing `private.staff_members` and managed `auth.users` are reused. No slug/SKU/price/quantity/status/tax/provider/snapshot columns, feature policies, generic CRUD or production fixtures were installed.

## Independent scrutiny

Reviewer: collaboration agent `core_scrutiny`, using the scrutinize skill.
Verdict: PASS / ship for structural Core SQL and dictionary.

Traced Auth → Customer → Order → Items/Payments and Product → Variant → Item. Verified PK/FK types, DB UUID defaults/bigint identity, all six RESTRICT edges, nullable Variant linkage, FK indexes, no premature unique Payment cardinality, RLS and ordinary table/sequence privilege revocation. Dictionary matched all 18 columns. Simpler alternatives (documents only, or deferring Variant/Item) would not prevent physical integration conflicts. This is a source review verdict, not runtime/business acceptance.

## Target and apply evidence

- `.env.local` URL host matches `mpzsrprdvvmhormesrva.supabase.co`; keys were never logged.
- Project name: `techanapdev's Project`; region `ap-northeast-1`; ACTIVE_HEALTHY; PostgreSQL 17.11.
- Preflight public schema had no Core tables/sequences; existing migration `staff_auth`, remote version `20261010151646`; staff count one.
- Apply via MCP `apply_migration`, name `core_tables`, exact reviewed SQL: `success: true`.
- Actual new remote version: `20261011075836`. Local CLI timestamp is `20261011075113`; existing staff local timestamp also differs from remote history. No bulk CLI `db push` or migration-history repair was performed.
- Postflight six new tables have zero rows. No real or synthetic Customer/Order/Payment was inserted.
- Staff count remains one. `is_active_staff()` definition MD5 remains `98aab462066e161b83e4468843e9e2b2` before/after.

## Verification results

| Layer | Result | Evidence / limit |
| --- | --- | --- |
| Source scrutiny | PASS | Independent concrete SQL/dictionary review before apply |
| Remote migration history | PASS | core_tables version and normalized statements match reviewed file |
| Live catalog | PASS | 18 columns, 6 PKs, 6 RESTRICT FKs, 1 UNIQUE auth link, 12 total indexes |
| SQL assertions | PASS | Actual catalog defaults/types/nullability/indexes/RLS/no policies/grants; assertions enabled |
| Authenticated/anon SQL privileges | PASS | No table privileges or identity sequence privileges for either ordinary role |
| Anonymous REST reads | PASS | GET `select=id&limit=1` on all six tables returns HTTP 401 with PostgreSQL permission-denied code 42501, not table missing |
| Static | PASS with cache override | `SWC_NATIVE_BINDING_CACHE=/private/tmp/perfume-core-swc-native pnpm check` (lint, route typegen/tsc, foundation assertions) |
| Production build | PASS with cache override | `SWC_NATIVE_BINDING_CACHE=/private/tmp/perfume-core-swc-native pnpm build` |
| Formatting/diff | PASS | pnpm format for touched Markdown/generated TS, git diff --check |

Initial plain `pnpm check` and `pnpm build` failed loading the SWC native carrier because its default user cache pruning lock was outside sandbox write permissions (`ERR_SWC_NATIVE_CACHE`). Verified installed carrier documentation and retried with the allowed temporary cache path above; no dependency/config/lockfile changes were needed.

## Advisor findings and limits

RLS-without-policy INFO for seven tables is expected deny-by-default (including existing Staff); unused-index INFO for five new FK indexes is expected before any feature data exists. Do not remove FK indexes because fresh tables report no usage.

Security advisor also reported callable SECURITY DEFINER functions and disabled leaked-password protection. `is_active_staff()` authenticated invocation is intentional ADR 0003 authorization. Live metadata shows `rls_auto_enable()` returns `event_trigger`; the advisor RPC warning alone does not establish a callable ordinary RPC or exploit. These existing/project settings were not modified in this migration.

References: [no-policy advisor](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy), [SECURITY DEFINER advisor](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable), [password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

## Remaining owner work and risks

- Catalog owner extends existing Product/Variant tables with reviewed slug/SKU/dimensions/prices/publication and operations.
- Access owner implements verified session-to-Customer linkage (signup currently only creates Auth), profile and retention/anonymization. Initial required auth FK blocks deleting linked Auth users; it does not implement account deletion.
- Checkout owner adds amounts/currency/quantity, immutable versioned snapshots, transactions/idempotency, lifecycle and provider verification with appropriate access grants/policies.
- Custom owner reviews sellable identity with Catalog/Checkout before tightening Variant nullability or enabling Custom checkout.
- Generated types map PostgreSQL bigint to TypeScript number. New shared API contracts must preserve ID decimal text before JSON/JS parsing (for example reviewed SQL projections), not stringify an already rounded number. No application client now consumes this Core.
- RESTRICT prevents parent cascade deletion; privileged direct leaf deletion/update still needs authorized owner operations/retention controls. Core alone is not an immutable sales audit system.
- Before future CLI pushes, reconcile local/remote migration timestamps through a reviewed plan. Do not automatically replay or repair history.

Not verified: authenticated session HTTP access, successful business writes, actual deletion behavior with fixtures, transaction/concurrency/payment/provider/browser flows, or fresh DBML parser execution. No claim of feature readiness. No browser acceptance was attempted because no UI behavior changed. No customer/payment data writes, cleanup, feature activation, commit/push/deploy or external messages.

Unrelated pre-existing `.claude/` and `docs/perfume/catalog-crud-onboarding.md` were preserved; archived `.docs/perfume/*` files were not edited.
