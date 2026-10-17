# content

Coordinator: Member 2 (proposed); assignments follow [team ownership](../../../docs/perfume/team-ownership.md).

Purpose: Landing preview now; future localized landing, policies and contact content. The current landing is a user-requested Gold & Noir design study with locally stored generated concept imagery, scent-family editorial cards and an atelier link to the dedicated custom preview. It does not add products, formulas, prices or order operations.

Planned routes: /{locale}, /admin/content, /{locale}/contact, /{locale}/policies/[slug]. Only landing preview is implemented in this foundation; other routes remain 404.

Create files when work is approved:

- components/: feature UI; import shared/ui primitives.
- queries.server.ts: server-only reads with authorization.
- actions.ts: validated, authorized Server Actions for actual mutations.
- schemas.ts: approved input validation. Keep domain types in this feature.

Integration: Uses shared primitives and common/content messages. Collection links target the landing section; the atelier CTA opens /{locale}/customize through the locale-aware Link adapter. Catalog product routes are not implemented.

The landing composes the preview-only ingredient section from `custom-perfume` between collection and atelier content. Ingredient selection behavior belongs to that feature; translations remain in the existing `content.ingredients` namespace. The separate customize route reuses its interactive component without persisting selection or adding cart integration. See the [storefront UI handoff guide](../../../docs/perfume/design-system/storefront-ui-handoff.md).

Pending client requirements: Approved branding, copy, content editing and inquiry scope.

Read [architecture](../../../docs/perfume/architecture.md), [contracts](../../../docs/perfume/feature-contracts.md), [DB](../../../docs/perfume/db.md), and [requirements](../../../docs/perfume/requirements-open-questions.md). Store/admin use the same domain rules. No empty implementation stubs or mixed server/client barrels.
