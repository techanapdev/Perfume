# Shared shells

Member 2 coordinates visual changes. StoreShell is server-rendered; menu/language switcher are interactive leaves.
AdminShell is a static Thai structure preview. Neither navigation nor disabled items provide authorization.
No feature or provider logic here. Store → admin crosses root layouts and loads a full document.
See [architecture](../../../docs/perfume/architecture.md) and [ownership](../../../docs/perfume/team-ownership.md).

## Storefront navigation

The locale root layout mounts `StoreShell({children})` once. Feature pages must not wrap it again. `StoreHeader` resolves translations on the server; `StoreNavigationLinks`, `StoreMenu` and `LanguageSwitcher` are client leaves. Both menu layouts use `storeMainLinks` and `storeAccountLinks` from `store-navigation.ts`. UI reference remains in the footer.

`StoreNavigationLinks` accepts readonly `{href, label, prominent?}` items, an accessible `label`, optional `variant: 'main' | 'account' | 'menu'`, and a client-side `onNavigate` callback. Active page matching uses locale-less pathnames and route boundaries; anchors do not receive `aria-current="page"`.

Account actions use a minimal treatment: Sign in stays a text link and the prominent Sign up item uses the shared outline Button with a transparent background and subdued border, including in the mobile menu. Active-page and focus states remain available; no shared Button API or tokens are changed.

`StoreMenu` now accepts `mainItems`, `accountItems` and `labels: {menu, close, description, main, account}`. This replaces its previous fixed page-label props; the sole current caller, `StoreHeader`, is updated. The drawer closes after selection and on expansion to the desktop breakpoint. `StoreShell` retains its original API.

Account links are static public destinations, not session or permission state. Coordinate future session-aware presentation with the account owner; keep server authorization in features.

See the [Thai storefront UI handoff guide](../../../docs/perfume/design-system/storefront-ui-handoff.md) for routes, contracts, team boundaries and the pending manual browser checklist. Run `node --experimental-strip-types scripts/store-navigation.check.mts` from the repository root for navigation assertions.
