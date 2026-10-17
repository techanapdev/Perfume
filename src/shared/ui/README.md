# Shared UI baseline

Coordinator: Member 2. These are editable shadcn-style primitives using the individually pinned Radix packages. The current Gold & Noir design study was requested on 17 October 2026 and awaits visual acceptance.
The shadcn 4.21.1 CLI registry currently emits cn/radix-ui umbrella imports; the foundation adapts imports to the existing cn utility and scoped Radix dependencies. No additional theme provider is required.

- Import specific files. No barrel mixing client and server exports.
- No feature, business rule, Supabase or provider imports here.
- Tokens: src/app/globals.css. Change semantic tokens before adding per-page colors.
- Interactive Radix primitives have client boundaries; passive primitives remain server-safe.
- Dialog/Sheet require localized closeLabel. Supply a title and description for every overlay.
- UI kit covers focus, error, disabled and loading states. This is a working baseline, not client-approved branding.
- Future CLI generation must be reviewed for imports, dependency ranges, accessibility and token compatibility; never blindly overwrite shared components.

See [UI workflow](../../../docs/perfume/ui-workflow.md) and [architecture](../../../docs/perfume/architecture.md).

## Theme reference for developers and AI

Status: **Gold & Noir design draft, review pending**. Inspect `/th/ui-kit` or `/en/ui-kit` for color swatches, typography, spacing/radius and component usage. `ui-kit-foundations.tsx` reads values from browser CSS; use **Refresh CSS values** after editing styles. JavaScript is required for the measured values. The dark foundation and gold primary also apply to account and admin surfaces. These samples document the current implementation, not approved branding.

| Need           | Source of truth                                                    | Usage                                                                                                           |
| -------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| Colors         | `src/app/globals.css`: `:root` values and `@theme inline` mappings | `bg-background text-foreground`, `bg-primary text-primary-foreground`, `text-muted-foreground`, `border-border` |
| Font family    | `body` in `globals.css`                                            | Inherit the stack; listing a font does not load it or prove which font renders each glyph                       |
| Typography     | Semantic utilities and actual components                           | Button: `text-label`; Input: `text-base`; CardTitle: `text-xl font-medium`; UI Kit title: `text-heading`        |
| Spacing/radius | Tailwind scale and `--radius` mappings in `globals.css`            | Button: `gap-3 rounded-sm`; CardHeader: `p-6`; Card: `rounded-lg`                                               |
| Component API  | Specific files in this directory                                   | Import `Button` from `@/shared/ui/button`, not a feature-local copy                                             |
| Visible copy   | `messages/th/common.json` and `messages/en/common.json`            | Keep both locales in sync; reference samples use `common.kit.reference`                                         |

Values belong in CSS. Do not duplicate hex values, font sizes or font stacks in this guide. The current draft implements `text-eyebrow`, `text-heading`, `text-body`, `text-label`, `font-display` and `max-w-site` in `globals.css`. The UI Kit heading/body and live primitive samples demonstrate these roles. Display fonts use a local system fallback stack without a remote font request.

The existing Button, Badge, Card, Input, Dialog and Toaster APIs are preserved. Button dimensions, colors and typography follow the new draft; verify consumers visually before accepting the theme. Use `bg-overlay` for dark backdrops: `foreground` is now light text and must not be used as a dark overlay.

Use `site-container` for centered store sections and the UI Kit. It provides a shared maximum width, automatic inline margins and responsive gutters from `--site-width` and `--site-gutter`. Do not add another set of horizontal padding utilities to the same element. Full-bleed backgrounds belong on the outer section.

```tsx
import {Button} from '@/shared/ui/button';

<Button variant="outline" size="sm">
  ...
</Button>;
```

Button variants: `default`, `outline`, `secondary`, `ghost`, `link`. Sizes: `default`, `sm`, `lg`, `icon`. Loading is demonstrated with `disabled`, `aria-busy` and an icon, not a `loading` prop. Icon-only buttons need a localized accessible name. Form validation and table data in UI Kit are local/static demonstrations.

Keep page layout and business behavior in the owning feature. Preserve keyboard/focus, labels and overlay titles/descriptions. Check callers and coordinate API or shared-token changes before editing them. Do not infer feature validation or authorization from these examples.

Owner preparation and review checkpoints: [Design system checklist](../../../docs/perfume/design-system/design-system-onboarding.md). Explained with real examples from the UI Kit and landing page: [Walkthrough](../../../docs/perfume/design-system/design-system-walkthrough.md). Refer to actual CSS/component source if documentation differs from implementation.

## Building pages while the theme is in progress

The badge at the top of `/th/ui-kit` is the theme status. The Gold & Noir draft is available for review; visual acceptance and approval of branding remain pending.

1. Use only classes and components shown in the UI Kit.
2. No raw values: no hex colors or arbitrary sizes such as `text-[15px]`. Use token classes and typography roles.
3. Need something the UI Kit lacks? Ask the design system owner; do not create a feature-local component.
4. After Draft 1, values change freely and pages follow automatically. Renaming a token, role or prop must be announced first.
