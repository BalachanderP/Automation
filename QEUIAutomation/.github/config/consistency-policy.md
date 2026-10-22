---
title: consistent Behavior policy
verison: 1.0
Owner: REITSUITE QA Automation Team
Standard: EY Enterprise QA Automation Standard
Status: Active
type: configuration
SSOTFor:consistent agent behavior (top-priority Policy)

ReferenceBy:
     - copilot-instructions.md
     -agents/reitsuite-api-master-agent.md
     -governance/routing-policy.md
     -config/out-behavior.md
     -governance/agent-manifest.md
     -sub-agents/**

---
# Deterministic and Consistent Behavior Policy

**Authority:** This file is the single source of truth for deterministic and consistent behavior across the REITSuite API test-automation agent system. All agents (master, sub-agents, knowledge modules) MUST comply. When any other file conflicts with this policy in matters of consistency, this file wins.

**Instruction priority order** (applies to every rule in this system):

1. This policy (`consistency-policy.md`) — for consistency, determinism, and stability.
2. `config/enforcement-rules.md` — non-negotiable cross-stage controls.
3. `governance/agent-manifest.md` — for agent ownership and routing boundaries.
4. `governance/routing-policy.md` — for menus, navigation, option order, workflow selection.
5. `config/output-behavior.md` — for user-visible response format.
6. `.github/knowledge/architecture/*.md` and `.github/knowledge/standards/*.md` — for architecture, coding, and test standards.
7. `agents/reitsuite-api-master-agent.md` — orchestration rules not covered above.
8. Individual sub-agent files — local execution rules only.

If a lower-priority file restates a higher-priority rule, the higher-priority version is authoritative.

---

## 1. Core Guarantee

The custom agent MUST behave consistently for the same type of request.

For identical or equivalent user inputs, the agent MUST produce:

- the same workflow,
- the same routing decision,
- the same menu order,
- the same output structure,
- the same naming style,
- the same approval behavior, and
- the same validation approach,

every time.

The agent MUST NOT behave differently across sessions, turns, or executions unless the **user input**, **available source data** (Swagger/OpenAPI, registries, standards), or **approved configuration** has changed.

---

## 2. Mandatory Consistency Rules

The agent MUST:

1. Always follow the instruction priority order in the header above.
2. Always use the same single source of truth for each decision area.
3. Always use `governance/routing-policy.md` for menus, navigation, option order, and workflow selection.
4. Always use `output-behavior.md` for user-visible response format.
5. Always use `governance/agent-manifest.md` for agent ownership and routing boundaries.
6. Always use the same workflow order for the same request type.
7. Always use the same approval-gate behavior for generation, update, execution, and auto-fix actions.
8. Always use the same naming convention for files, tests, scenarios, Allure labels, and generated artifacts.
9. Always apply reuse-first logic before creating new code.
10. Always classify security coverage as **Required**, **Conditional**, or **Not Applicable**.
11. Always classify failures as one of:
    - **Application defect**
    - **Test issue**
    - **Framework issue**
    - **Environment issue**
    - **Contract gap**
    - **Requirement gap**
    - **Security finding**
    - **REST compliance finding**
12. Always separate functional and security coverage.
13. Always evaluate role coverage for **SA**, **EA**, **EU**, **XR**, **XT** when the endpoint is protected.
14. Always enforce the **Enterprise Functional Test Layering Standard** defined in `.github/knowledge/standards/coding-standards.md` §2.0:

    ```text
    spec / service / payload / assertions / schema / model / matrix / helper
    ```

    Any content placed in the wrong layer is a governance finding.

15. Always enforce the **Enterprise Security Test Layering Standard** defined in `.github/knowledge/standards/coding-standards.md` §2.0-B for every `*.security.spec.ts`.

    Governance findings include:

    - Endpoint URLs in security specs
    - Authorization header assembly
    - ApiHelper instantiation
    - Raw attack payloads in security specs

    Probe requests MUST use:

    - `probe*`
    - `WithSecurityContext`
    - `WithoutAuth`
    - `WithToken`
    - `WithHostPoisoning`

    service methods (or `SecurityRequestHelper`).

    Additional rules:

    - Deny statuses MUST be explicit `HttpStatus[]` scenario arrays passed to:
      `SecurityAssertions.assertExpectedSecurityStatus`
    - `security-deny-status-catalog.ts` is a legacy shim.
    - New specs MUST NOT depend on it.
    - Numeric HTTP status literals in specs are prohibited.
    - Use `HttpStatus.*`.

16. Always treat the following files as the **canonical reference implementation** for all `*.security.spec.ts` files:

    - `tests/auth-api/analytics-entitlement/01.auth-api.post.manage.analytics-entitlement.security.spec.ts`
    - `tests/auth-api/analytics-entitlement/02.auth-api.get.analytics-entitlement.resource.security.spec.ts`

    Every generated or reviewed security spec MUST mirror their structure and data-driven approach, including:

    - SASP case arrays
    - service-level:
      - `WithSecurityContext`
      - `WithoutAuth`
      - `WithToken`
      - `WithHostPoisoning`
    - accessors on the `authApi`
    - `<domain>` fixture
    - `SecurityAssertions.assertSecurityProbeSafe(...)`
    - `saspId`
    - `category`
    - `module`
    - `httpMethod`
    - `role`
    - `payload`
    - `responseBody`
    - optional `businessDataKeys`
    - baseline-reflection detection for authorized (`200`) responses.

    17. Always enforce the fail-closed **Strict Enforcement Contract** in
    `.github/knowledge/standards/automation-standard.md` §3.10 for functional
    and security script creation, update, refactor, debug, and review.

    Generated artifacts MUST NOT be returned as complete, and reviews MUST
    NOT be marked `PASSED`, while any enterprise-layering violation remains.

    ---
    ## 3. Prohibited Inconsistent Behavior

The agent MUST NEVER:

- Randomly change menu wording.
- Randomly change menu order.
- Randomly add or remove menu options.
- Randomly switch between detailed and short workflows for the same request.
- Randomly ask extra questions when required information is already available.
- Randomly skip required workflow steps.
- Randomly generate different file structures for the same artifact type.
- Randomly change expected status-code logic.
- Randomly mix functional and security tests.
- Randomly choose between inline logic and reusable framework utilities.
- Randomly expose internal file reads, routing decisions, tool calls, or agent-loading details.

---

## 4. Stability Guarantee

If the same user request is repeated with the same project files, same
Swagger/OpenAPI contract, same registries, same standards, and same session
context, the response MUST be functionally equivalent every time.

Wording may vary only when the variation does not affect any of the following:

- Workflow order
- Routing
- Menu structure
- Approval behavior
- Test coverage decisions
- File naming
- Code architecture
- Status-code classification
- Security applicability
- Final output structure

---

## 5. Conflict Handling

If two instructions appear to conflict, apply in order:

1. Follow the higher-priority instruction (see priority order at the top of this file).
2. If both instructions have the same priority, follow the more specific instruction.
3. If the conflict still remains, use the configured single source of truth for that decision area.
4. If no source of truth resolves the conflict, ask exactly **one** focused clarification question.

The agent MUST NEVER guess, merge conflicting rules, or choose behavior randomly.

---

## 6. Enforcement

- Every sub-agent MUST reference this file (by relative path) in its
  "Conflict Authority" or equivalent section instead of restating these rules.

- Reviewer agents (`05`, `07`, `10`, `11`, `12`) MUST flag any output,
  artifact, or workflow that violates this policy as a governance finding.

- Script generator (`06`) and script reviewers (`07`, `10`) MUST verify every
  created or modified artifact against its file-type responsibilities before
  completion.

- Any proposed exception MUST be approved by the user and recorded in this file
  before being applied.