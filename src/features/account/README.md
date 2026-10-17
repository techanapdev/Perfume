# account

Coordinator: Member 3 (proposed); assignments follow [team ownership](../../../docs/perfume/team-ownership.md).

Purpose: Conditional member login, registration, profile and saved addresses.

Routes: /{locale}/login (customers and staff), /{locale}/register, /auth/confirm (email link, token_hash). /{locale}/account is not built yet. Decisions: [ADR 0003](../../../.docs/adr/0003-supabase-auth-login.md).

Admin gate: call requireStaff() in every admin page, Server Action and route handler; layouts and proxy never authorize.

Create files when work is approved:

- components/: feature UI; import shared/ui primitives.
- queries.server.ts: server-only reads with authorization.
- actions.ts: validated, authorized Server Actions for actual mutations.
- schemas.ts: approved input validation. Keep domain types in this feature.

Integration: Supabase auth → server authorization; own orders view → orders.

## Storefront UI handoff

Login and registration now compose `LoginScreen` / `RegisterScreen` with the shared feature-level `AuthPageShell`. The locale layout supplies the storefront navbar/footer; do not mount another StoreShell in these routes. Responsive presentation and copy use existing semantic tokens and `common.auth` translations.

Existing form components, actions, validation, session authorization and safe redirect logic are unchanged. These forms still invoke real Auth actions when submitted; they are not local demo forms. The UI session did not submit credentials, send confirmation email or verify a live session. Navbar account links currently do not reflect session state. No new access policy is implied.

Read the [Thai storefront UI handoff guide](../../../docs/perfume/design-system/storefront-ui-handoff.md) for source locations, component contracts, next decisions and manual acceptance checks.

Pending client requirements: Guest/member scope (Q-A01/Q-A02/Q-A05) and staff roles (Q-B01).

Read [architecture](../../../docs/perfume/architecture.md), [contracts](../../../docs/perfume/feature-contracts.md), [DB](../../../docs/perfume/db.md), and [requirements](../../../docs/perfume/requirements-open-questions.md). Store/admin use the same domain rules. No empty implementation stubs or mixed server/client barrels.
