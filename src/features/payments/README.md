# payments

Coordinator: Member 4 (proposed); assignments follow [team ownership](../../../docs/perfume/team-ownership.md).

Purpose: One selected sandbox provider and verified payment events.

Planned routes: /api/webhooks/<selected-provider> (fixed path after selection). Only landing preview is implemented in this foundation; other routes remain 404.

Create files when work is approved:
- components/: feature UI; import shared/ui primitives.
- queries.server.ts: server-only reads with authorization.
- actions.ts: validated, authorized Server Actions for actual mutations.
- schemas.ts: approved input validation. Keep domain types in this feature.

Integration: Trusted checkout amount + order identity; verified idempotent events → orders.

Pending client requirements: Provider, payment methods, sandbox credentials and refund handling.

Read [architecture](../../../docs/perfume/architecture.md), [contracts](../../../docs/perfume/feature-contracts.md), [DB](../../../docs/perfume/db.md), and [requirements](../../../docs/perfume/requirements-open-questions.md). Store/admin use the same domain rules. No empty implementation stubs or mixed server/client barrels.
