# custom-perfume

Coordinator: Member 3 (proposed); assignments follow [team ownership](../../../docs/perfume/team-ownership.md).

Purpose: Birthdate recommendation and fragrance choices; shop determines ratios.

Routes: /{locale}/customize is now a public design preview. /admin/custom-perfume remains unbuilt.

`components/custom-perfume-preview.tsx` composes the dedicated page using the same `IngredientPreview` as the landing section. The locale layout supplies StoreShell; the thin customize route does not mount another shell. Introductory copy lives in `content.customize`. Navigating between the landing and dedicated preview starts a separate in-memory selection; no account requirement, persistence, formula, pricing or cart integration is added. Read the [Thai storefront UI handoff guide](../../../docs/perfume/design-system/storefront-ui-handoff.md) before continuing the feature.

## Ingredient animation preview

The landing now composes `components/ingredient-section.tsx`, a server-rendered section with one interactive `IngredientPreview` client component and a small decorative SVG `IngredientBottle`. The user authorized a preview-only maximum of three sample bases on 17 October 2026. Choices, moods and the selection limit do not establish production ingredient inventory, formulation or business rules. Liquid visuals do not encode a recipe or ratio.

`preview-selection.ts` owns the client-safe preview state transitions; removing and resetting remain possible at the limit. State stays in memory without persistence or server operations. Existing shared Button/Badge APIs are used. Animations use CSS/SVG with a reduced-motion alternative and no new dependencies. Localized landing copy lives in `content.ingredients` in both existing locale files; i18n configuration is unchanged.

The liquid surface now rises progressively for one, two and three selected bases, filling the visible bottle interior at three. Removing a base or clearing transitions it back down. `components/ingredient-liquid.ts` supplies SVG display coordinates; drop travel and ripple placement follow the target surface. The fixed bottle clip stays outside the moving liquid layer. Reduced motion applies the target level immediately.

Sample-base choice buttons use generated botanical/material thumbnails from `public/images/ingredients/*-v1.webp`, rendered through the existing Next Image component with fixed thumbnail dimensions and responsive image sizes. The adjacent localized base names label each button; images have empty alt text to avoid repeating those labels. These generated concept photographs do not establish real ingredient inventory or a formula.

Run `node --experimental-strip-types scripts/ingredient-preview.check.mts` for selection-cap, removal, replacement, reset, immutability, animation-key and progressive-fill assertions. Browser animation and accessibility acceptance require a separate manual check.

Create files when work is approved:

- components/: feature UI; import shared/ui primitives.
- queries.server.ts: server-only reads with authorization.
- actions.ts: validated, authorized Server Actions for actual mutations.
- schemas.ts: approved input validation. Keep domain types in this feature.

Integration: Approved configuration → cart/order summary; pricing contract → checkout.

Pending client requirements: Client algorithm, examples, choices, constraints, pricing and birthdate retention.

Read [architecture](../../../docs/perfume/architecture.md), [contracts](../../../docs/perfume/feature-contracts.md), [DB](../../../docs/perfume/db.md), and [requirements](../../../docs/perfume/requirements-open-questions.md). Store/admin use the same domain rules. No empty implementation stubs or mixed server/client barrels.
