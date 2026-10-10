# Supabase foundation

Coordinator: Member 3 (proposed). No client is created at import or during landing render. The proxy creates one only when a Supabase auth cookie is present (refresh-session.ts).

- browser.ts: explicit browser factory, public publishable key only.
- refresh-session.ts: proxy-only session refresh (ADR 0003). Authorization is requireStaff() in features/account, never the proxy.
- server.ts: request-scoped factory. Read-only cookies by default; use writable mode only inside a Server Action or Route Handler.
- config.ts: literal Next public env reads and configuration validation; errors never include key values.
- No credentials are needed for preview routes. Missing configuration fails only when a factory is explicitly called.
- Before auth work, implement and verify session refresh, server authorization and RLS. These factories alone do not provide authentication.
- Generate Database types from the approved real schema before domain queries. No hand-written database types or production connections here.

See [DB design](../../../../docs/perfume/db.md), [security](../../../../docs/perfume/security-and-data.md), and [contracts](../../../../docs/perfume/feature-contracts.md).
