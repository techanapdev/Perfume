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
