---
title: Operating Model
version: 1.1.1
lastReviewed: 2026-09-14
status: Active
owner: REITSuite QE Automation
standard: EY Enterprise QA Automation Standard
type: Governance
ssofFor: Governance authority model and verified runtime/tooling profile
---

# REITSuite Operating Model

This file defines the governance authority model and the verified runtime/tooling profile.

Instruction arbitration order is owned by `../config/consistency-policy.md`.

## Authority model

1. Consistency policy: `../config/consistency-policy.md`
2. Enforcement rules: `../config/enforcement-rules.md`
3. Agent manifest: `./agent-manifest.md`
4. Routing policy: `./routing-policy.md`
5. Output behavior: `../config/output-behavior.md`

## Scope

- Governance changes infrequent, runtime changes frequent.
- Keep policy and runtime profile content scoped and minimal.
- Do not duplicate rules owned by the files above.

## Verified Project Profile

Repository facts in `package.json`, `playwright.config.ts`, and `tsconfig.json` are authoritative and override any version or command example appearing in documentation, agent files, or examples.

| Area | Standard |
|--------|----------|
| Runtime | Node.js `>=24.19.0 <25` |
| Test framework | Playwright Test with TypeScript strict mode |
| API client | Playwright `APIRequestContext` through `BaseApiService` and `ApiHelper` |
| Test organization | Auth, Client, REIT, Report, TrialBalance API domains |
| Test design | JSON matrices plus TypeScript payload factories and typed response models |
| Contract validation | Zod schemas and assertion-layer validation |
| Shared test data | `@reitsuite-qe/test-data` from `../../QESharedTestData` |
| Authentication | Role-based token helpers and generated storage state; secrets external to source |
| Reporting | Allure labels, attachments, normalization, redaction, history |
| Quality gates | `npm run lint`, `npm run typecheck`, `npm run format:check`, scope-specific Playwright execution |

### Rules

- Never assert a runtime version, script name, or command that this table and the repository manifests do not support.
- When this table and a manifest disagree, the manifest wins and this file must be corrected in the same change set.
- Folder ownership and path aliases are owned by `architecture.md` (`../knowledge/architecture/architecture.md`), not this file.
`