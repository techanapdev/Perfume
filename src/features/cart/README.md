# cart

Coordinator: Member 4 (proposed); assignments follow [team ownership](../../../docs/perfume/team-ownership.md).

Purpose: Draft shopping bag and quantity/configuration editing.

Planned routes: /{locale}/cart. Only landing preview is implemented in this foundation; other routes remain 404.

Create files when work is approved:
- components/: feature UI; import shared/ui primitives.
- queries.server.ts: server-only reads with authorization.
- actions.ts: validated, authorized Server Actions for actual mutations.
- schemas.ts: approved input validation. Keep domain types in this feature.

Integration: Consume catalog/custom contracts; send identity/quantity to trusted checkout.

Pending client requirements: Item contract, persistence and stock behavior.

Read [architecture](../../../docs/perfume/architecture.md), [contracts](../../../docs/perfume/feature-contracts.md), [DB](../../../docs/perfume/db.md), and [requirements](../../../docs/perfume/requirements-open-questions.md). Store/admin use the same domain rules. No empty implementation stubs or mixed server/client barrels.
