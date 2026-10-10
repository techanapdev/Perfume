# Shared UI baseline

Coordinator: Member 2. These are editable shadcn-style new-york neutral primitives using the individually pinned Radix packages.
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

Status: **baseline, new theme pending**. Inspect `/th/ui-kit` or `/en/ui-kit` for color swatches, typography, spacing/radius and component usage. `ui-kit-foundations.tsx` reads values from browser CSS; use **Refresh CSS values** after editing styles. JavaScript is required for the measured values. These samples document the current foundation, not approved branding.

| Need           | Source of truth                                                    | Usage                                                                                                                     |
| -------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Colors         | `src/app/globals.css`: `:root` values and `@theme inline` mappings | `bg-background text-foreground`, `bg-primary text-primary-foreground`, `text-muted-foreground`, `border-border`           |
| Font family    | `body` in `globals.css`                                            | Inherit the stack; listing a font does not load it or prove which font renders each glyph                                 |
| Typography     | Tailwind utilities used in the actual components                   | Button: `text-sm font-medium`; Input: `text-base`; CardTitle: `text-xl font-medium`; UI Kit title: `text-3xl sm:text-4xl` |
| Spacing/radius | Tailwind scale and `--radius` mappings in `globals.css`            | Button: `gap-2 rounded-md`; CardHeader: `p-6`; Card: `rounded-lg`                                                         |
| Component API  | Specific files in this directory                                   | Import `Button` from `@/shared/ui/button`, not a feature-local copy                                                       |
| Visible copy   | `messages/th/common.json` and `messages/en/common.json`            | Keep both locales in sync; reference samples use `common.kit.reference`                                                   |

Values belong in CSS. Do not duplicate hex values, font sizes or font stacks in this guide. Typography roles in the new theme remain pending: `text-body` and `text-label` are **not implemented**. Use existing utilities until a reviewed CSS mapping exists.

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

The badge at the top of `/th/ui-kit` is the theme status. `Baseline` means not ready; `Draft 1` means names are stable and pages can be built in parallel, while values may still change.

1. Use only classes and components shown in the UI Kit.
2. No raw values: no hex colors or arbitrary sizes such as `text-[15px]`. Use token classes and typography roles.
3. Need something the UI Kit lacks? Ask the design system owner; do not create a feature-local component.
4. After Draft 1, values change freely and pages follow automatically. Renaming a token, role or prop must be announced first.
