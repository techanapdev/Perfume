# Supabase foundation

Coordinator: Member 3 (proposed). No client is created at import or during landing render. The proxy creates one only when a Supabase auth cookie is present (refresh-session.ts).

- browser.ts: explicit browser factory, public publishable key only.
- refresh-session.ts: proxy-only session refresh (ADR 0003). Authorization is requireStaff() in features/account, never the proxy.
- server.ts: request-scoped factory. Read-only cookies by default; use writable mode only inside a Server Action or Route Handler.
- config.ts: literal Next public env reads and configuration validation; errors never include key values.
- No credentials are needed for preview routes. Missing configuration fails only when a factory is explicitly called.
- Before auth work, implement and verify session refresh, server authorization and RLS. These factories alone do not provide authentication.
- `database.types.ts` is generated from the live approved public Core schema (ADR 0004), not the 26-table proposal. Regenerate after reviewed feature migrations; do not hand-edit. No domain client wiring is added in the Core migration session.
- Generator maps Catalog bigint IDs to TypeScript numbers. Future shared API projections must preserve IDs as decimal text before JSON parsing; see the Core data dictionary. This type file alone is not an API/access contract.

See [DB design](../../../../docs/perfume/db.md), [security](../../../../docs/perfume/security-and-data.md), and [contracts](../../../../docs/perfume/feature-contracts.md).
