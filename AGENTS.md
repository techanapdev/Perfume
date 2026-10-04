# Perfume working agreements

## Start here
- Read README.md and the assigned feature README before editing.
- Business scope and pending questions: docs/perfume/product-scope.md and requirements-open-questions.md.
- Boundaries/ownership: docs/perfume/architecture.md and team-ownership.md.
- Input/result/access contracts: docs/perfume/feature-contracts.md, db.md and security-and-data.md. Examples are not approved implementation.
- UI changes: docs/perfume/ui-workflow.md and actual src/shared/ui source; use /th/ui-kit as reference.
- Communicate in Thai; keep code, identifiers and machine-facing briefs in English.

## Implementation
- Keep routes thin. Business rules belong to their feature, shared code must not import features/providers.
- Use existing primitives and semantic tokens; do not create local copies or silently alter shared APIs.
- Server Components by default; interactive leaves use client boundaries. Mark sensitive server modules with server-only.
- Keep server operations and client-safe exports separate; no global domain-types file.
- Create components/queries/actions/schemas only for approved work. No speculative services, empty source stubs or generic CRUD framework.
- No invented birthday formulas, ratios, prices, auth policies, provider choice or schema.
- Use camelCase, PascalCase for components/types and kebab-case filenames; no any; keep source files under 300 lines.
- Direct dependencies are pinned. Coordinate config/lockfile/i18n/shared changes with their owner.
- Read installed node_modules/next/dist/docs before new framework work. Do not assume APIs from older Next versions.
- No clients at import time. Keep privileged keys out of public env and logs. Generate DB types from real approved schema before queries.
- UI visibility is not authorization. Validate input and enforce session/role/ownership at every sensitive server operation.

## Verification and delivery
- Run pnpm check and pnpm build for foundation changes. Leave one small runnable assertion for nontrivial logic; do not add a test framework without agreement.
- Report exactly which layers were tested; static/build success does not prove browser, DB or payment.
- Before final browser acceptance, let the user choose tool verification, a manual checklist or skip. Checklist awaiting results/skip remain unverified.
- Preserve unrelated edits and all archived docs. Update canonical docs only, keep business decisions Pending/Proposed until approved.
- Record each code session in a new .docs/SESSIONLOG-<topic>-<date>.md.
- Do not initialize Git, commit, push, deploy, apply remote migrations, delete user data or send external messages without explicit authorization.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
