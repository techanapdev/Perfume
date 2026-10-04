# reporting

Coordinator: Member 1 (proposed); assignments follow [team ownership](../../../docs/perfume/team-ownership.md).

Purpose: Admin dashboard metrics and monthly reports.

Planned routes: /admin, /admin/reports. Only landing preview is implemented in this foundation; other routes remain 404.

Create files when work is approved:
- components/: feature UI; import shared/ui primitives.
- queries.server.ts: server-only reads with authorization.
- actions.ts: validated, authorized Server Actions for actual mutations.
- schemas.ts: approved input validation. Keep domain types in this feature.

Integration: Consume approved order/payment aggregates, never their client stores.

Pending client requirements: Revenue/date/status/refund metric definitions and report depth.

Read [architecture](../../../docs/perfume/architecture.md), [contracts](../../../docs/perfume/feature-contracts.md), [DB](../../../docs/perfume/db.md), and [requirements](../../../docs/perfume/requirements-open-questions.md). Store/admin use the same domain rules. No empty implementation stubs or mixed server/client barrels.
