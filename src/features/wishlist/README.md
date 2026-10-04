# wishlist

Coordinator: Member 2 (proposed); assignments follow [team ownership](../../../docs/perfume/team-ownership.md).

Purpose: Wishlist only if the shop confirms scope.

Planned routes: /{locale}/wishlist. Only landing preview is implemented in this foundation; other routes remain 404.

Create files when work is approved:
- components/: feature UI; import shared/ui primitives.
- queries.server.ts: server-only reads with authorization.
- actions.ts: validated, authorized Server Actions for actual mutations.
- schemas.ts: approved input validation. Keep domain types in this feature.

Integration: Consume catalog identity; member/guest persistence decision pending.

Pending client requirements: Inclusion and persistence policy.

Read [architecture](../../../docs/perfume/architecture.md), [contracts](../../../docs/perfume/feature-contracts.md), [DB](../../../docs/perfume/db.md), and [requirements](../../../docs/perfume/requirements-open-questions.md). Store/admin use the same domain rules. No empty implementation stubs or mixed server/client barrels.
