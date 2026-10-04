# orders

Coordinator: Member 4 (proposed); assignments follow [team ownership](../../../docs/perfume/team-ownership.md).

Purpose: Customer tracking/history and admin prepare/pack/ship/cancel.

Planned routes: /{locale}/orders/[id], /admin/orders. Only landing preview is implemented in this foundation; other routes remain 404.

Create files when work is approved:
- components/: feature UI; import shared/ui primitives.
- queries.server.ts: server-only reads with authorization.
- actions.ts: validated, authorized Server Actions for actual mutations.
- schemas.ts: approved input validation. Keep domain types in this feature.

Integration: Payments updates payment state; customers/account consume authorized order reads.

Pending client requirements: Lifecycle, cancellation/refund, tracking access and inventory policy.

Read [architecture](../../../docs/perfume/architecture.md), [contracts](../../../docs/perfume/feature-contracts.md), [DB](../../../docs/perfume/db.md), and [requirements](../../../docs/perfume/requirements-open-questions.md). Store/admin use the same domain rules. No empty implementation stubs or mixed server/client barrels.
