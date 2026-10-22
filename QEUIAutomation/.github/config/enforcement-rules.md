---
title: Non-Negotiable Rule Card
version: 1.2.0
lastReviewed: 2026-09-10
owner: REITSuite QE Automation
standard: EY Enterprise QA Automation Standard
status: Active
type: Configuration
ssotFor: Non-negotiable rules re-asserted at every stage boundary
---

# Non-Negotiable Rule Card

**This card is normative and compaction-resistant.** Every agent MUST re-assert it at each stage boundary instead of re-reading the full knowledge corpus. No other file may restate these rules; other files link here.

1. **LAYERS** — `spec = what` | `service = how` | `payload = what to send` | `assertions = what to verify` | `schema = contract` | `model = data shape` | `matrix = combinations` | `helper = generic utilities`.
   Cross-layer leakage is a CRITICAL finding.

2. **GATES** — Explicit user confirmation is required before:
   - test-case generation
   - script generation
   - test execution
   - auto-fix

   A gate is never implied by a previous approval.

3. **STATUS** — Authority order: enterprise standard > runtime evidence.

   Never downgrade an expectation to match observed behaviour.

   Swagger/OpenAPI status codes are documentation-only and MUST NOT be used to set or compare expected status.

   POST intent is resolved by the deterministic algorithm in:

   `./knowledge/standards/test-standards.md`

   (POST Intent Resolution); the applied rule number is recorded in:

   `ANALYSIS_HANDOFF.statusResolution.ruleApplied`.

4. **QUESTIONS** — Only `03-test-requirements-analyzer` may ask business questions.

   All other agents emit `ANALYZER_QUESTION_REQUEST`.

5. **REUSE** — `Reuse > Extend > Create`.

   A `CREATE` decision without a populated `searchedPaths` array in
   `reuseEvidence` is a CRITICAL finding.

6. **HANDOFFS** — Every handoff carries `provenance`:

   - schemaVersion
   - contractRevision
   - producedBy
   - producedAt

   Consumers hard-fail on incompatible, mismatched, or out-of-session provenance.

   Never infer missing handoff fields.

7. **SECURITY** — `*.security.spec.ts` routes every assertion through
   `SecurityAssertions`.

   Inline `expect()` on status/body in a security spec is a CRITICAL finding.

8. **OUTPUT** — No preamble; the first character is final output.

   Narration detection is anchored per `output-behavior.md` §1, never bare-token matching.

   Long-running steps report countable outcomes:

   ✅ `54 operations found`

   Never activity narration such as:

   ❌ `Read routing-policy.md`

9. **CONTEXT CARD** — Every response continuing an in-progress workflow opens with the
   **Current Context** table (`API Type`, `Module`, `Endpoint`, `Status`)
   followed by the **Workflow Summary** stage tracker, both defined in
   `output-behavior.md` §§2.1-2.2.

   Exactly one stage is `IN PROGRESS`; every glyph carries its text status label.

10. **ACCESSIBILITY** — Status is emoji + UPPERCASE text label, never colour alone.

    Plain `1-13` numbering.

    Keycap emoji prohibited.

    `plain text mode` must be honoured.

11. **NAVIGATION** — Navigation labels are a closed set:

    - ⬅️ Go Back
    - 🏠 Home
    - ❌ Cancel
    - 🔎 Search
    - 📋 Summary
    - ❌ Exit

    (Main Menu only)

    Never invent, abbreviate, or suffix them with a target name.

    `⬅️ Go Back` is the last numbered option, or `0` in dynamic `1-N` pickers.

    Canonical definition: `routing-policy.md` §5.0.

12. **MARKDOWN ONLY** — No raw HTML (`<br>`, `<strong>`, `<div>`, inline styles)
    in user-facing output or configuration files.

    Multi-line table cells reference a menu section instead of embedding `<br>` lists.

13. **EVIDENCE** — Never emit:
    - `TBD`
    - `Not Provided`
    - `Assumed Baseline`

    Unknown facts are questions, not placeholders.

## Ownership Exclusions

| Finding Type Excluded | Owner |
|----------------------|--------|
| Expected-vs-documented status mismatch, REST semantics, defect classification | `12-api-compliance-reviewer` (`10-playwright-api-automation-code-reviewer` MUST NOT report it) |
| Layering, naming, imports, assertion routing, reuse evidence | `10-playwright-api-automation-code-reviewer` (`12-api-compliance-reviewer` MUST NOT report it) |

## Unmapped Endpoint Policy

When an endpoint exists in the OpenAPI document but not in `endpoint-registry.json`:

1. set 'mappingStatus:"UNMAPPED" in the contract handoff.
2. Derive analysis from the contract only. Never improvise dependencies, setup steps or parent entities.
3. Surface the gap to the user and offer registry extension before generation proceeds

Detailed rationale lives in the canonical knowledge docs. Do not restate in here.
