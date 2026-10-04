# checkout

Coordinator: Member 4 (proposed); assignments follow [team ownership](../../../docs/perfume/team-ownership.md).

Purpose: Contact, address, shipping, final quote and order submission.

Planned routes: /{locale}/checkout, /{locale}/checkout/result. Only landing preview is implemented in this foundation; other routes remain 404.

Create files when work is approved:
- components/: feature UI; import shared/ui primitives.
- queries.server.ts: server-only reads with authorization.
- actions.ts: validated, authorized Server Actions for actual mutations.
- schemas.ts: approved input validation. Keep domain types in this feature.

Integration: Compose catalog/custom/promotion rules → orders and payments.

Pending client requirements: Guest policy, shipping, currency, price snapshots and idempotency.

Read [architecture](../../../docs/perfume/architecture.md), [contracts](../../../docs/perfume/feature-contracts.md), [DB](../../../docs/perfume/db.md), and [requirements](../../../docs/perfume/requirements-open-questions.md). Store/admin use the same domain rules. No empty implementation stubs or mixed server/client barrels.
