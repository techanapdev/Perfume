# custom-perfume

Coordinator: Member 3 (proposed); assignments follow [team ownership](../../../docs/perfume/team-ownership.md).

Purpose: Birthdate recommendation and fragrance choices; shop determines ratios.

Planned routes: /{locale}/customize, /admin/custom-perfume. Only landing preview is implemented in this foundation; other routes remain 404.

Create files when work is approved:
- components/: feature UI; import shared/ui primitives.
- queries.server.ts: server-only reads with authorization.
- actions.ts: validated, authorized Server Actions for actual mutations.
- schemas.ts: approved input validation. Keep domain types in this feature.

Integration: Approved configuration → cart/order summary; pricing contract → checkout.

Pending client requirements: Client algorithm, examples, choices, constraints, pricing and birthdate retention.

Read [architecture](../../../docs/perfume/architecture.md), [contracts](../../../docs/perfume/feature-contracts.md), [DB](../../../docs/perfume/db.md), and [requirements](../../../docs/perfume/requirements-open-questions.md). Store/admin use the same domain rules. No empty implementation stubs or mixed server/client barrels.
