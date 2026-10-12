# ADR 0004: One shared Core migration for Catalog and Commerce

Date: 2026-10-11
Status: Accepted by the user; independent SQL/document scrutiny PASS; applied to `mpzsrprdvvmhormesrva` as `core_tables` remote version `20261011075836` on 2026-10-11.

## Context

Feature owners must not create duplicate tables or incompatible foreign keys. The full 26-table DBML is a proposal, not an approved business schema. Catalog, Custom and Checkout owners still design their feature details.

## Decision

- Create only `public.customers`, `products`, `product_variants`, `orders`, `order_items` and `payments` in one migration. Reuse existing `private.staff_members` and managed `auth.users`.
- Product and Variant primary keys are DB-generated `bigint` identities. Other Core primary keys are DB-generated UUIDs. Foreign keys use the referenced primary key type.
- Core columns contain only primary keys, relationship keys and `created_at`. Do not install proposed slug/SKU, prices, currency defaults, statuses, tax calculations, provider fields or snapshot JSON before owner review.
- One Product has many Variants. Each Variant belongs to one Product. Each Order belongs to one Customer; each Item and Payment belongs to one Order.
- Customer purchase requires membership. The initial Customer auth link is `NOT NULL UNIQUE` with deletion restricted. Existing auth signup does not automatically create a Customer. Checkout owner and access owner must implement verified session-to-Customer linkage before purchase.
- All Core foreign keys use `ON DELETE RESTRICT`. This blocks parent deletion while dependent records exist instead of removing sales history. Account anonymization/deletion and catalog archive workflows remain owner-designed. The existing staff/Auth cascade is unchanged and cannot cascade into Core sales tables.
- `order_items.variant_id` is nullable structural capacity while Custom sellable identity is pending. This does not approve standard purchases without a Variant or a Custom checkout contract. Future owners add kind/identity validation before feature activation.
- No unique constraint on `payments.order_id` is installed. Checkout owns attempts, retries and lifecycle and may add reviewed constraints; this is not approval of a payment retry policy.
- Enable RLS on all six tables, install no policies, and revoke table/identity-sequence privileges from PUBLIC, anon and authenticated. Privileged roles remain trusted; these controls do not provide business authorization for a service-role operation.
- Member 3 coordinates migrations and generated types; Members 1/3/4 review their relationships. Feature owners extend existing Core tables with migrations instead of creating them again.

## Alternatives

- Contract documents only: do not prevent incompatible physical tables during parallel implementation.
- Install all proposed business columns: prematurely chooses unresolved lifecycle, pricing, Custom and snapshot contracts.
- Defer Variant and Item creation: leaves the Catalog/Order seam to independent migrations, contrary to the user's integration goal.
- Nullable Customer auth link with `SET NULL`: permits account deletion with detached historical Customer rows, but introduces a deletion workflow not yet designed. Initial RESTRICT preserves history; the access/Order owners can later approve a nullable link and anonymization policy.

## Consequences and limits

The Core is a structural dependency, not a working catalog, checkout, reporting or payment flow. It has no sale amounts or purchase snapshots yet. Feature owners must add reviewed columns, input/result contracts, transaction/idempotency rules and authorization before use. UUIDs cross JS/API boundaries as strings; bigint Catalog IDs must use decimal strings in new shared API contracts to avoid precision loss, without converting through Number.

Applying is authorized only after independent scrutiny passes and the target is verified as `mpzsrprdvvmhormesrva`. It adds six empty tables and does not modify existing users, staff rows or the staff authorization function. Commit, push, frontend deployment, feature activation and customer/payment writes are outside this authorization.
