# catalog

Coordinator: Member 1 (proposed); assignments follow [team ownership](../../../docs/perfume/team-ownership.md).

Purpose: Catalog, search, categories, product details and admin product editing.

Planned routes: /{locale}/products, /{locale}/products/[slug], /admin/products. Only landing preview is implemented in this foundation; other routes remain 404.

Create files when work is approved:
- components/: feature UI; import shared/ui primitives.
- queries.server.ts: server-only reads with authorization.
- actions.ts: validated, authorized Server Actions for actual mutations.
- schemas.ts: approved input validation. Keep domain types in this feature.

Integration: Product/variant identity → cart; availability and trusted prices → checkout.

Pending client requirements: Variants, inventory and product copy.

Read [architecture](../../../docs/perfume/architecture.md), [contracts](../../../docs/perfume/feature-contracts.md), [DB](../../../docs/perfume/db.md), and [requirements](../../../docs/perfume/requirements-open-questions.md). Store/admin use the same domain rules. No empty implementation stubs or mixed server/client barrels.
