# account

Coordinator: Member 3 (proposed); assignments follow [team ownership](../../../docs/perfume/team-ownership.md).

Purpose: Conditional member login, registration, profile and saved addresses.

Planned routes: /{locale}/login, /{locale}/register, /{locale}/account. Only landing preview is implemented in this foundation; other routes remain 404.

Create files when work is approved:
- components/: feature UI; import shared/ui primitives.
- queries.server.ts: server-only reads with authorization.
- actions.ts: validated, authorized Server Actions for actual mutations.
- schemas.ts: approved input validation. Keep domain types in this feature.

Integration: Supabase auth → server authorization; own orders view → orders.

Pending client requirements: Guest/member scope and auth methods.

Read [architecture](../../../docs/perfume/architecture.md), [contracts](../../../docs/perfume/feature-contracts.md), [DB](../../../docs/perfume/db.md), and [requirements](../../../docs/perfume/requirements-open-questions.md). Store/admin use the same domain rules. No empty implementation stubs or mixed server/client barrels.
