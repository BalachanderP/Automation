---
title: Design Patterns & Coding Standards
version: 3.0.2
lastReviewed: 2026-09-01
owner: REITSuite QE Automation
standard: EY Enterprise QA Automation Standard
status: Active
type: Knowledge
ssotFor: TypeScript, Playwright, service, assertion, payload, matrix, helper, naming standards
---

# 2 - Design Patterns & Coding Standards

## Table of Contents

- [2.0 Enterprise Functional Test Layering Standard (STRICT)](#20-enterprise-functional-test-layering-standard-strict)
- [2.0-B Enterprise Security Test Layering Standard (STRICT)](#20-b-enterprise-security-test-layering-standard-strict)
- [API Coding Guidelines](#api-coding-guidelines)
- [2.1 API Service Pattern](#21-api-service-pattern)
- [2.2 Test Matrix Pattern](#22-test-matrix-pattern)
- [2.3 Payload Factory Pattern](#23-payload-factory-pattern)
- [2.4 Custom Fixtures](#24-custom-fixtures-base-tests)
- [2.5 Constants & Enums](#25-constants--enums)
- [2.6 Naming Conventions](#26-naming-conventions)
- [2.7 Test Suite Structure](#27-test-suite-structure-strict)
- [2.7.1 Allure Metadata Standard](#271-allure-metadata-standard-mandatory)
- [2.8 Test Title Format](#28-test-title-format-strict)
- [2.9 Test Tagging](#29-test-tagging)
- [2.10 Test Steps](#210-test-steps)
- [2.10.1 Test Case Banner Standard](#2101-test-case-banner-standard-mandatory)
- [2.11 Clean-Run-Clean Pattern](#211-clean-run-clean-pattern-strict)
- [2.12 Assertion Patterns](#212-assertion-patterns)
- [2.13 User Roles](#213-user-roles)
- [2.14 Domain-Specific Cleanup](#214-domain-specific-cleanup-patterns)
- [2.15 Expired Token Tests](#215-expired-token-tests-mandatory)
- [2.16 Security Test Categories](#216-security-test-categories)
- [2.17 JSDoc Comments](#217-jsdoc-comments)
- [2.18 Shared Test Data Package](#218-shared-test-data-package-reitsuite-qetest-data)
- [2.19 Response Contract Validation](#219-response-contract-validation)
- [2.20 Error Handling & Resilience](#220-error-handling-resilience)
- [2.21 API URL Construction](#221-api-url-construction-strict)
- [2.22 Zod Response Schema Pattern](#222-zod-response-schema-pattern)
- [2.23 TypeScript Strictness Rules](#223-typescript-strictness-rules)
- [2.24 Review Severity Mapping](#224-review-severity-mapping)
- [2.25 Review & Governance Checklist](#225-review-governance-checklist)

---

# 2.0 Enterprise Functional Test Layering Standard (STRICT)

**Authority:**

This section is the canonical enterprise layering standard for functional test scripts.

All agents:

- generator
- reviewer
- debugger
- code reviewer
- coverage analyzer
- REST compliance reviewer

MUST enforce these rules.

Any violation is a governance finding under:

```text
.github/config/consistency-policy.md
```

**Scope:**

Functional test scripts.

Security test scripts follow the same layering plus §2.12.1 Security Assertion Rule.

---

## 2.0.1 Layer Responsibility Matrix

| File Type | Single Responsibility |
|------------|----------------------|
| `*.spec.ts` | Test flow + assertions (WHAT to test) |
| `*.service.ts` | API calls only (HOW to call the API) |
| `*.payload.ts` | Request body creation (WHAT to send) |
| `*.assertions.ts` | Response validation (WHAT to verify) |
| `*.schema.ts` | Zod / OpenAPI schema validation (WHAT the contract looks like) |
| `*.model.ts` | Typed response/entity models (WHAT the data looks like) |
| `*.matrix.json` | Test data combinations (`userRole`, `expectedStatusCode`, ...) |
| `*.helper.ts` | Generic reusable utilities |

---

## 2.0.2 Spec File (`*.spec.ts`)

Spec files contain **only test behavior**.

### MUST Include

- Test scenarios
- Test data selection (from matrix / fixtures)
- Test execution flow
- Assertions
- Tags
- Allure metadata
- RBAC role verification
- Business rule verification
- Security verification
- Schema validation calls
- Response verification

### MUST NOT Include

- Endpoint URLs
- Request construction logic
- Header creation
- Token management
- Payload generation logic
- Response parsing
- Retry Implementation
- Business helper methods
- Reusable validation utilities

## 2.0.3 Service File (`*.service.ts`)

Service files contain **only API communication logic**.

### MUST Include

- Endpoint paths
- HTTP methods
- Request execution
- Query parameters
- Route parameters
- Header setup
- Authentication handling
- Retry logic
- Logging
- Correlation IDs
- Response parsing
- Schema parsing
- Response wrapping
- Error translation
- Common API helper usage (`ApiHelper`, `BaseApiService`)

### MUST NOT Include

- Playwright test blocks (`test`, `test.describe`, `test.step`)
- Test assertions
- Test matrices
- Business rules
- Scenario-specific validation
- Test tags
- Allure metadata
- Expected status checks
- Business validations

---

## 2.0.4 Payload File (`*.payload.ts`)

### MUST Include

- Request body creation
- Default values
- Dynamic test data
- Payload transformation
- Payload cloning

### MUST NOT Include

- API calls
- Assertions
- Test execution

---

## 2.0.5 Assertions File (`*.assertions.ts`)

### MUST Include

- Business assertions
- Response assertions
- State comparison
- Contract assertions

### MUST NOT Include

- API calls
- Test data generation

---

## 2.0.6 Final Enterprise Rule (One-Line Summary)

- **Spec** = WHAT to test
- **Service** = HOW to call the API
- **Payload** = WHAT to send
- **Assertions** = WHAT to verify
- **Schema** = WHAT the contract looks like
- **Model** = WHAT the data looks like
- **Matrix** = WHICH combinations to run
- **Helper** = Generic reusable utilities

---

## 2.0.7 Enforcement

- **Generator ("06")**
  - MUST scaffold each layer in its own file.
  - MUST NOT emit disallowed content into the wrong layer.

- **Reviewers ("07", "10", "12")**
  - MUST reject any PR-like change that places disallowed content in the wrong layer.
  - MUST classify the finding as an enterprise-layering violation.

- **Coverage Analyzer ("11")**
  - MUST report per-layer file presence for every endpoint under review.

- **Debugger ("09")**
  - MUST NOT resolve failures by moving logic across layers to bypass this standard.
  - If a fix requires re-layering, escalate to the generator.

---

# 2.0-B Enterprise Security Test Layering Standard (STRICT)

### Authority

This section is the canonical enterprise standard for **security (SASP) test scripts**.

It mirrors Section 2.0 for functional tests but adds security-specific responsibilities and prohibitions.

All agents MUST enforce these rules.

Any violation is a governance finding under:

```text
.github/config/consistency-policy.md
```

### Scope

Applies to every:

- `*.security.spec.ts`
- Supporting security layers

Functional layering (§2.0) still applies.

If a conflict exists, security-layering rules take precedence.

---

## 2.0-B.1 Security Layer Responsibility Matrix

| File Type | Single Responsibility |
|------------|----------------------|
| `*.security.spec.ts` | Security test flow + SASP assertions (WHAT to attack, WHAT to verify) |
| `*.service.ts` (`probe*` methods) | Attack-vector API communication (HOW to send the probe) |
| `*.payload.ts` / shared SASP catalogs | Attack payload construction (WHAT malicious input to send) |
| `assertions/security-assertions.ts` | Security-specific assertions (deny status, no leakage, no sensitive data) |
| `assertions/security-deny-status-catalog.ts` | **Legacy compatibility shim only.** New specs pass explicit `HttpStatus[]` scenario arrays to `assertExpectedSecurityStatus`; do not add rules here. |
| `assertions/security-failure-report-builder.ts` | Structured security failure reporting |
| `*-security-matrix.json` | Security test data (SASP ID, category, role, expected deny status, payload set) |
| `helpers/api/security/*.ts` | Security request helpers (token tampering, header injection, session tampering) |
| `@reitsuite-qe/test-data` (SASP catalogs) | Shared attack payload catalogs (SQL, XSS, CRLF, Command, Directory Traversal, RFI/LFI, Host Header, CORS origins) |

---

## 2.0-B.2 Security Spec File (`*.security.spec.ts`)

Security spec files contain **only security test behavior**.

### MUST Include

- SASP-tagged test scenarios (`SASP-01`, `SASP-03`, etc. in test title)
- `TestTags.SECURITY` on every test
- Allure metadata:
  - epic
  - feature
  - story labelled as **Security Compliance Tests (SASP)**
- Attack-vector selection from shared SASP payload catalogs
- Role-based execution (`SA`, `EA`, `EU`, `XR`, `XT`) per matrix
- Invalid-token-state coverage:
  - empty
  - invalid
  - malformed
  - tampered
  - expired
- Calls to `probe*` service methods (never functional CRUD methods)
- `SecurityAssertions.assertExpectedSecurityStatus(...)` for deny-status verification
- `SecurityAssertions.assertNoLeakage(...)` for response-body leakage checks
- `AuthAssertions.assertNoSensitiveData(...)` for PII/token/stack-trace leakage checks
- Schema validation calls (contract must still hold under attack)
- One `test.step()` per attack case with concise step titles naming the attack category

### MUST NOT Include

- Endpoint URLs, request construction, header assembly, or token-tampering logic
  - belongs in `service.ts` / `security-request-helper.ts`
- Raw attack payload literals (SQL strings, XSS strings, traversal strings)
  - belongs in shared SASP catalogs or `*.payload.ts`
- Deny-status hardcoded lists inline
  - pass explicit per-scenario `HttpStatus[]` arrays to `SecurityAssertions.assertExpectedSecurityStatus`
  - do **not** depend on `security-deny-status-catalog.ts` (legacy shim only)
- Response parsing, retry logic, or correlation-ID handling
- Business helper methods or reusable validation utilities
- Functional CRUD assertions (`AuthAssertions.assertUserCreated`, etc.)
  - these belong in functional specs
- Ad-hoc:
  ```ts
  expect(...).toBe(401)
  ```
  Use:
  ```ts
  SecurityAssertions.assertExpectedSecurityStatus(...)
  ```
  so the deny catalog is respected.

---

## 2.0-B.3 Service File - Security Probe Methods (`probe*` in `*.service.ts`)

Security probe methods live in the **same service file** as functional methods but MUST be named with the `probe` prefix and MUST contain only communication logic for the attack vector.

### MUST Include

- `probe<Action>TokenState(userRole, ..., tokenState)` for invalid-token-state probes
- `probe<Action>(userRole, ..., options)` accepting:
  - headers
  - query
  - body
  - token overrides
- Header injection
- Session tampering
- CORS-origin override
- Host-header override plumbing
- Request execution via:
  - `ApiHelper`
  - `BaseApiService`
- Response wrapping into:
  ```ts
  { status, body, headers }
  ```
  for security assertions to consume

### MUST NOT Include

- SASP assertion logic
- SASP payload literals (payloads MUST come from callers/shared catalogs)
- Test tags
- Allure metadata
- Playwright `test.step()` blocks
- Business validation
- Expected-status classification
- Deny-status catalogs
- Silent swallowing of non-2xx responses
  - always surface `status` and `body`

---

## 2.0-B.4 Security Payload / SASP Catalog Files

### MUST Include

- Enumerated attack payload arrays grouped by SASP category
- Labelled payload objects:
  ```ts
  { label, value }
  ```
  when labels improve failure diagnostics
- Deterministic ordering (never randomize between runs)

### MUST NOT Include

- API calls
- Assertions
- Playwright `test` blocks
- Environment-specific values:
  - secrets
  - real user data
  - real tokens

---

## 2.0-B.5 Security Assertions Files (`assertions/security-*.ts`)

### MUST Include

- `assertExpectedSecurityStatus(status, message, allowedStatuses)`
  - deny-status verification
  - caller passes explicit `HttpStatus[]` per scenario

- `assertNoLeakage(body)`
  - response body does not leak:
    - stack traces
    - SQL errors
    - framework internals

- `assertNoSensitiveData(body)`
  - no:
    - PII
    - tokens
    - secrets
    - internal identifiers

- Structured failure reporting via:
  ```text
  security-failure-report-builder.ts
  ```

- `resolveLegacyExpectedDenyStatus(...)`
  - remains only as a backward-compatibility shim
  - do NOT extend its rule table for new specs

### MUST NOT Include

- API calls
- Test data / attack payload generation
- Playwright `test` blocks
- Matrix parsing

---

## 2.0-B.6 Security Matrix Files (`*-security-matrix.json`)

### MUST Include

Fields:

```json
{
  "saspId": "",
  "category": "",
  "userRole": "",
  "expectedDenyStatus": [],
  "payloadCatalogRef": "",
  "description": ""
}
```

Rules:

- One row per attack-vector × role combination in scope
- Deterministic row order (never re-sort between runs)

### MUST NOT Include

- Inline attack payload literals (reference the catalog instead)
- Comments containing secrets or real credentials
- Environment-specific values

---

## 2.0-B.7 Security Helper Files (`helpers/api/security/*.ts`)

### MUST Include

- Token-state builders
  - empty
  - invalid
  - malformed
  - tampered
  - expired

- Header-injection builders
  - CRLF
  - host-header override
  - CORS origin override

- Session-context tampering builders
  - browser session ID overrides
  - correlation ID overrides

### MUST NOT Include

- API calls
  - helpers return builders / payload fragments
  - the service performs the call

- Assertions
- Playwright test blocks
- Business logic

---

## 2.0-B.8 Final Enterprise Rule (Security - One-Line Summary)

- **Security Spec** = WHAT to attack + WHAT to deny
- **Service probe** = HOW to send the attack
- **SASP Catalog / Payload** = WHICH malicious inputs to try
- **Security Assertions** = WHAT a valid denial looks like
- **Deny Status Catalog** = LEGACY compatibility shim only; not a source of truth for new specs
- **Security Matrix** = WHICH attack × role combinations to run
- **Security Helper** = Reusable tamper / injection builders

---

## 2.0-B.9 Enforcement

### Generator ("06")

MUST:

- Place SASP payload arrays in shared catalogs or `*.payload.ts`
- Place URL / header / token construction in:
  - `*.service.ts` (`probe*`)
  - `security-request-helper.ts`
- Never place those concerns in `*.security.spec.ts`

### Reviewers ("07", "10")

MUST:

- Reject any `*.security.spec.ts` that:
  - assembles endpoint URLs
  - assembles authorization headers
  - creates `ApiHelper` instances
  - contains raw attack-payload literals

- Flag any use of:

```ts
resolveLegacyExpectedDenyStatus(...)
```

in new code.

### REST Compliance Reviewer ("12")

MUST:

- Verify each explicit `HttpStatus[]` deny array is REST-semantically justified.
- Verify correct status usage such as:
  - 401
  - 403
  - 400
  - 404

- Reject numeric literals:

```ts
401
403
414
```

Prefer:

```ts
HttpStatus.UNAUTHORIZED
HttpStatus.FORBIDDEN
```

and other enum members.

### Coverage Analyzer ("11")

MUST report per endpoint:

- Whether every applicable SASP category has coverage.
- Whether System Administrator security-row coverage exists.

Role matrix completeness required for:

- SA
- EA
- EU
- XR
- XT

Missing required rows are governance findings.

### Debugger ("09")

MUST NOT:

- Relax deny-status assertions
- Remove SASP cases
- Downgrade leakage checks

to make security tests pass.

Such situations are application defects or genuine security findings and MUST be escalated per:

```text
consistency-policy.md
```

Rule 11.

---

### 2.0-B.10 Canonical Reference Implementation (MANDATORY TEMPLATE)

Every generated or reviewed `*.security.spec.ts` MUST mirror the structure of the two canonical reference specs:

- `tests/auth-api/analytics-entitlement/01.auth-api.post.manage.analytics-entitlement.security.spec.ts` (POST / mutation endpoints)
- `tests/auth-api/analytics-entitlement/02.auth-api.get.analytics-entitlement.resource.security.spec.ts` (GET / resource endpoints)

Their accompanying service is the reference for probe methods:

- `src/api-services/auth/analytics-entitlement-service.ts`
  - `getAnalyticsEntitlementWithSecurityContext(options)`
  - `getAnalyticsEntitlementWithHostPoisoning(host, xForwardedHost)`
  - `getAnalyticsEntitlementWithoutAuth()`
  - `getAnalyticsEntitlementWithToken(token)`

**Mandatory structural elements (copy verbatim per feature):**

1. **Imports**
   - `SecurityAssertions`
   - `CommonAssertions`
   - `HttpStatus`
   - `HttpMethod`
   - `TestTags`
   - `UserRoles`
   - Token builders:
     - `buildExpiredJwtToken`
     - `buildInvalidJwtToken`
     - `buildMalformedJwtToken`
     - `buildTamperedJwtToken`
   - `TokenService`
   - SASP catalogs from `@reitsuite-qe/test-data`
   - label from `allure-js-commons`
   - `NO_CONFIG`
   - `API_ENDPOINTS`
   - `ApiHelper`
   - `expect` on status or raw request calls

2. **Module constants**
   - Define `const MODULE_NAME = '...'`
   - Define readonly string array:
     - `<MODULE>_BUSINESS_DATA_KEYS`
   - List all top-level business fields returned by the endpoint.

3. **Data-driven SASP array**
   - Define:
     ```ts
     const querySecurityCases: readonly [
       saspId,
       category,
       injectedField,
       payloadCases
     ][]
     ```
   - Iterate using a single `test(...)` per case.
   - One test step per payload.
   - Do not create hand-written individual tests per SASP scenario.

4. **Fixture accessor**
   - Every probe call must go through:
     - `authApi.<domain>.<method>WithSecurityContext(...)`
     - `<method>WithHostPoisoning(...)`
     - `<method>WithoutAuth()`
     - `<method>WithToken(token)`
   - Do not use:
     - `request.put`
     - `request.get`
     - `request.fetch`
     - `new ApiHelper(...)`
     - `sendRequestWithoutToken`

5. **Assertion shape**
   - Use:
     ```ts
     SecurityAssertions.assertSecurityProbeSafe(
       status,
       body,
       message,
       {
         saspId,
         category,
         module,
         httpMethod,
         role,
         url,
         payload: {
           label,
           value,
           injectedField,
           requestBody
         },
         responseBody,
         businessDataKeys,
         correlationId
       }
     );
     ```
   - Token-state tests must use:
     ```ts
     SecurityAssertions.assertExpectedSecurityStatus(
       status,
       message,
       HttpStatus.UNAUTHORIZED,
       context
     );
     ```

6. **Baseline reflection detection**
   - When:
     ```ts
     status === HttpStatus.OK
     ```
   - Fetch clean baseline:
     ```ts
     expect(JSON.parse(body)).toEqual(baseline);
     ```
   - Call local helper:
     ```ts
     assertNoNewPayloadReflection(
       body,
       baseline,
       payloadValue,
       message
     );
     ```
   - Use implementation copied verbatim from reference spec.

7. **SASP-05 headers block**
   - Single test calling:
     ```ts
     SecurityAssertions.assertRequiredResponseHeaders(...)
     SecurityAssertions.assertNoForbiddenResponseHeaders(...)
     ```

8. **SASP-14 Host Poisoning block**
   - Iterate `HOST_HEADER_PAYLOADS`.
   - Call dedicated `WithHostPoisoning(...)` service method.
   - Never manually assemble:
     - `Host`
     - `X-Forwarded-Host`
       headers inside the spec.

9. **SASP-15 CORS block**
   - Pass:
     ```ts
     extraHeaders.Origin
     ```
     via `WithSecurityContext`.
   - Assert:
     - `access-control-allow-origin`
     - `Access-Control-Allow-Origin`
   - Verify values are not reflected.

10. **SASP-16 HTTP method override**
    - Pass:
      ```ts
      extraHeaders['X-HTTP-Method-Override']
      ```
      via `WithSecurityContext`.
    - Do not call `request.fetch` with an arbitrary method.

11. **SASP-20 token-state block**
    - Single test using readonly `TokenCase[]`.
    - Cover:
      - missing
      - empty
      - invalid
      - malformed
      - tampered
      - expired
    - Use:
      - `WithoutAuth()` for missing token
      - `WithToken(token)` for all other scenarios

Any `*.security.spec.ts` that deviates f*om this structural template is con*idered a governance finding and MU*T be refactored to match.

---

##*✅ API Coding Guidelines

- Develop*rs MUST follow HTTP status standar*s.
- Avoid returning `200` for all*APIs.
- Ensure DELETE APIs return *204` when no body is returned.
- E*sure POST create operations return*`201` with a `Location` header.

-*-

## 2.23 TypeScript Strictness R*les

Type safety requirements are *andatory across services, helpers,*fixtures, and specs.

- Do not use*`any` in production test code.
- U*e explicit interfaces, union types* or `unknown` with narrowing.
- Do*not use unsafe casts that bypass v*lidation.
- Avoid chained casts th*t skip type checks.
- Avoid non-nu*l assertions (`!`) unless proven b* guard logic in the same scope.
- *se typed response models for servi*e method returns.
- Do not return *ntyped raw payloads.
- Guard index*d access before usage.
- Handle un*hecked indexed access safely.
- Pr*fer runtime-validated parsing (for*example, Zod) when consuming exter*al or untrusted response bodies.

**Non-compliant TypeScript strictne*s is a review failure and must be *emediated before completion.**

--*

## 2.24 Review Severity Mapping
*Use this severity scale for review*findings and remediation priority.*
| Severity | Meaning | Examples |*Required Action |
|-----------|---*-------|-----------|-----------|
|*Critical | High risk to correctnes*, security, or contract compliance*| Wrong expected status behaviour,*security bypass, endpoint built in*spec layer against standards | Blo*k completion, fix before proceed |*| Warning | Important quality or m*intainability issue with moderate *isk | Missing edge-case coverage, *artial typing gaps, non-canonical *atterns | Fix in current iteration or explicitly accept with rationale |
| Info | Minor improvement with low immediate risk | Naming/readability cleanup, optional refactor | Track and address when practical |

---

## 2.25 Review & Governance Checklist

**Purpose:** Keep all custom QA agents aligned to one execution standard for test-case and script generation.

### 2.25.1 Global Consistency Rules

- Use repo-valid import aliases and file names only.
- Avoid placeholder examples such as:
  - `constants`
  - `enum`
  - `types`
- Keep one validation taxonomy across agents (13 categories from `test-standards.md`).
- Enforce SLA and Zod checks when in scope:
  - requirements
  - risk
  - contract
- Do not apply as blanket mandatory checks for every endpoint.
- Use security payload strategy consistently:
  - Default: representative payload sampling.
  - Deep mode: full payload sweeps for high-risk or explicit deep-security requests.
- Preserve standardised API failure diagnostics through assertion-layer APIs backed by:
  - `Logger.handleError(...)`
  - `SecurityAssertions.assertExpectedSecurityStatus(...)`

### 2.25.2 Canonical Policy Owners

- Validation taxonomy:
  - `.github/knowledge/standards/test-standards.md`
- Analyzer coverage mapping:
  - `.github/sub-agents/design/03-api-test-requirements-analyzer.md`
- Script generation policy:
  - `.github/sub-agents/automation/06-api-test-script-generator.md`
- Script traceability policy:
  - `.github/sub-agents/automation/07-api-test-script-reviewer.md`
- Code quality enforcement:
  - `.github/sub-agents/governance/10-playwright-api-automation-code-reviewer.md`
- Alias and coding conventions:
  - This document
- Dependency registry structure contract:
  - `.github/knowledge/registries/dependency-registry.json`
  - (`registryContract` section)
- Endpoint registry structure contract:
  - `.github/knowledge/registries/endpoint-registry.json`

#### Coverage Ownership Contract (Mandatory)

- `03-api-test-requirements-analyzer.md`
  - Coverage requirements definition
- `04-api-test-designer.md`
  - Coverage implementation in scenarios
- `05-api-test-case-reviewer.md`
  - Coverage validation of generated scenarios
- `11-api-test-coverage-analyzer.md`
  - Coverage metrics, traceability gaps, reporting only

### 2.25.3 Audit Checklist Before Release

- [ ] No stale `constants` or `enum` examples in sub-agent documents.
- [ ] No conflicting validation-category names across analyzer/designer/reviewer documents.
- [ ] No blanket wording that conflicts with scope-driven SLA/Zod policy.
- [ ] Security payload policy matches default-sampling plus deep-mode-sweep model.
- [ ] Import examples resolve against current repository structure.
- [ ] Cross-agent references point to current core file numbers.
- [ ] Dependency registry contract keys and endpoint mappings are internally consistent.
- [ ] Coverage ownership language is consistent across 03/04/05/11.


### 2.25.4 Fast Audit Commands

- Search stale alias patterns:

```bash
rg -n "\\.constants|\\.enum" .github/sub-agents
```

- Search SLA/Zod wording:

```bash
rg -n "SLA|Zod|schema validation" .github/sub-agents/core .github/sub-agents/knowledge
```

- Search security payload policy wording:

```bash
rg -n "representative payload|full payload sweep|deep-security" .github/sub-agents
```

- Search taxonomy alignment terms:

```bash
rg -n "Validation Applicability Matrix|category IDs 1-13|Normalized categories" .github/sub-agents
```

- Validate dependency registry contract shape (PowerShell):

```powershell
$r = Get-Content ".github/knowledge/registries/dependency-registry.json" -Raw | ConvertFrom-Json

$required = @(
  "metadata",
  "entityHierarchy",
  "dependencyRegistry",
  "ownership",
  "agentGuidance"
)

foreach ($k in $required) {
  if (-not $r.PSObject.Properties.Name.Contains($k)) {
    throw "missing dependency-registry key: $k"
  }
}

$e = Get-Content ".github/knowledge/registries/endpoint-registry.json" -Raw | ConvertFrom-Json

$required = @(
  "metadata",
  "endpoints",
  "endpointToDependencyMapping",
  "ownership",
  "agentGuidance"
)

foreach ($k in $required) {
  if (-not $e.PSObject.Properties.Name.Contains($k)) {
    throw "missing endpoint-registry key: $k"
  }
}

if ($e.endpoints.Count -lt 1) {
  throw "no endpoints found"
}
```

---

### 2.25.5 Change Control

- Update policy owner files first.
- Re-scan all sub-agent docs after any standards edit.
- If a rule changes, update both generator and reviewer (never one side only).
- Record governance version/date when policy changes are merged.

---

## 2.1 API Service Pattern

API service classes in `src/api-services/` extend `BaseApiService` and encapsulate API calls for a specific domain.

Responsibilities:

- Construct URLs and requests.
- Apply authentication and headers.
- Execute API calls.
- Return typed response/result data.
- Never assert or validate responses.

### Example

```ts
import { BaseApiService } from '@api-services/base-api.service';
import { APIRequestContext } from '@base/base-test';

export class AuthApiService extends BaseApiService {
  readonly apiServiceName = 'Auth Api Service';

  constructor(request: APIRequestContext) {
    super(request);
  }

  async addUser(
    userRole: string,
    payload: object
  ): Promise<ApiResponseResult<UserResponse>> {
    // Implementation using this.apiHelper.sendRequest(...)
  }
}
```

### Rules

- One service class per API domain.
- All HTTP calls go through:
  - `this.apiHelper.sendRequest()`
  - `this.apiHelper.sendRequestWithToken()`
- Service methods accept `userRole` as the first parameter for token-based authentication.
- Service methods do not accept expected outcomes for validation purposes.
- Return typed response/result objects containing:
  - status
  - headers
  - body
  - request context
- Never return untyped payloads.
- Never call:
  - `expect`
  - `Zod` validation
  - `Logger.handleError`
  - assertion helpers
    from a service method.

---

### 2.1.1 Enterprise File Responsibility Model

| File / Layer | Responsibility |
|--------------|---------------|
| Spec (`*.spec.ts`, `*.security.spec.ts`) | Test flow and assertion orchestration; call assertion-layer APIs |
| Service (`*-service.ts`) | API calls only; return typed response/result data |
| Payload (`*.payload.ts`) | Request body creation only |
| Assertions (`src/assertions/**/*.ts`) | Status, header, body, business-rule, and schema-backed response validation plus standardised diagnostics |
| Schema (`src/framework/models/*response.ts`) | Zod/OpenAPI structural contracts |
| Model | Domain data type/interface definitions |
| Matrix (`*-matrix.json`) | Test data, scenario combinations, and role/status mappings |
| Helper (`src/helpers/**/*.ts`) | Generic reusable utilities only |

> Golden Rule and per-layer include/exclude lists are canonical in:
>
> `automation-standard.md §3`
>
> (`./automation-standard.md#3-file-responsibility-model-golden-rule`)
>
> Do not restate here.

Reusable response checks must **not** be implemented inline in specs.

Specs select the expected outcome and invoke assertion modules. Assertion modules compare the expected result with the service result and apply schemas where required.

---

#### 2.1.1.1 Layer Include / Exclude Rules (Authoritative)

These lists are binding for all generation and review agents. Any violation is a compliance defect and **MUST** be corrected before the artefact is accepted.

##### Spec Files (`*.spec.ts`, `*.security.spec.ts`)

✅ Allowed:

- Test scenarios
- Test data selection
- Test execution flow
- Assertions (via assertion-layer APIs)
- Tags
- Allure metadata
- RBAC role verification
- Business-rule verification
- Security verification
- Schema validation calls and response verification via assertion layer

❌ Not Allowed:
- Endpoint URLs,
- Request Construction,
- Header Creation,
- Token Management
- Direct HTTP implementation
- Inline reusable validators
- Shared utility logic
- Schema definitions
- Payload construction business logic
- Generic parsing/transform layers
- Retry Implementation
- Reusable Validation utilities

### Service Files (`*-service.ts`)

✅ Allowed:

- Endpoint paths
- HTTP methods
- Request execution
- Query parameters
- Route parameters
- Header setup
- Authentication handling
- Retry logic
- Logging
- Correlation IDs
- Response parsing
- Schema parsing
- Response wrapping
- Error translation
- Common API helper usage

❌ Not Allowed:

- Playwright `test` / `expect` blocks
- Test assertions
- Test matrices
- Business rules
- Scenario-specific validation
- Test tags
- Allure metadata
- Expected status checks
- Scenario-specific logic

---

### Payload Files (`*.payload.ts`)

✅ Allowed:

- Request body creation
- Default values
- Dynamic test data
- Payload transformation
- Payload cloning

❌ Not Allowed:

- API calls
- Assertions
- Test execution

---

### Assertion Files (`src/assertions/**/*.ts`)

✅ Allowed:

- Business assertions
- Response assertions
- State comparison
- Contract assertions
- Common API helper usage for standardized failure diagnostics

❌ Not Allowed:

- API calls
- Test data generation
- Test data matrices

---

### Schema / Model / Matrix / Helper

- **Schema:** Zod/OpenAPI structural contracts only.
- **Model:** Domain data type/interface definitions only.
- **Matrix:** `userRole`, `expectedStatusCode`, and scenario combinations only. No assertion logic.
- **Helper:** Generic reusable utilities only. Never endpoint-specific assertions, business validation, or payload ownership.

---

## 2.2 Test Matrix Pattern

Test matrices are JSON files in `src/test-matrices/` that drive data-driven test parameterisation.

### Example

```json
{
  "//": "Description: Create System Administrator -- role-based test matrix",

  "tests": {
    "createSystemAdminUser": [
      {
        "userRole": "System Administrator",
        "expectedStatusCode": 201
      }
    ],

    "createSystemAdminUserUnauthorized": [
      {
        "userRole": "Engagement Administrator",
        "expectedStatusCode": 403
      },
      {
        "userRole": "Engagement User",
        "expectedStatusCode": 403
      },
      {
        "userRole": "External Checklist User",
        "expectedStatusCode": 403
      }
    ],

    "missingUserIdSystemAdmin": [
      {
        "userRole": "System Administrator",
        "expectedStatusCode": 400
      }
    ]
  }
}
```

### Matrix Key Naming Convention

| Scenario Type | Key Pattern | Example |
|---------------|-------------|---------|
| Positive | `<action><Entity>` | `createSystemAdminUser` |
| Unauthorized | `<action><Entity>Unauthorized` | `createSystemAdminUserUnauthorized` |
| Duplicate | `<action>Duplicate<Entity>` | `createDuplicateSystemAdminUser` |
| Missing field | `missing<Field><Entity>` | `missingUserIdSystemAdmin` |
| Invalid email | `emailValidationNegative<Entity>` | `emailValidationNegativeSA` |
| Positive email | `emailValidationPositive<Entity>` | `emailValidationPositiveSA` |
| External domain | `externalDomain<Entity>` | `externalDomainSystemAdmin` |
| Self-delete | `selfDelete<Entity>` | `selfDeleteSystemAdmin` |
| Empty body | `emptyBody<Entity>` | `emptyBodySystemAdmin` |
| Expired token | `<action><Entity>ExpiredToken` | `getExternalUserDataVisibilityExpiredToken` |

### MATRIX_PATHS Registration

Every new matrix file must be registered in:

```ts
src/test-matrices/matrix-paths.ts
```

### Role Values (Exact Strings in Matrix JSON)

```text
System Administrator
Engagement Administrator
Engagement User
External Checklist User
External Temp User
```

### Role/Status-only Entries

Matrix entries MUST contain exactly:

```json
{
  "userRole": "...",
  "expectedStatusCode": 200
}
```

Never introduce alternative casing or aliases such as:

```json
{
  "UserRole": "...",
  "ExpectedStatusCode": 200
}
```

---

### Functional Spec Generation Rule

For role-based functional scenarios, generate tests using matrix loops in spec files:

```ts
for (const { userRole, expectedStatusCode } of testMatrix.tests[scenarioKey]) {
  // test implementation
}
```

### Scope Restriction

This loop-generation rule applies only to functional specs (`*.spec.ts`) and does **not** apply to security specs (`*.security.spec.ts`).

---

## 2.3 Payload Factory Pattern

Payload factories in `src/payload/` generate request bodies with faker-based unique data and support partial overrides.

### Example

```ts
import { faker } from '@faker-js/faker';

export interface SystemAdminPayload {
  userId?: string;
  role?: number;
  resource?: object;
  resourceId?: number | null;
}

export function createSystemAdminPayload(
  overrides?: Partial<SystemAdminPayload>
): SystemAdminPayload {
  return {
    userId: `P.REITSuite_Ptest.${faker.number.int({ min: 5, max: 10 })}@ey.com`,
    role: RoleId.SYSTEM_ADMIN,
    resource: {
      resourceType: ResourceType.APPLICATION
    },
    resourceId: null,
    ...overrides
  };
}
```

### Rules

- Factory functions return typed interfaces, not `any`.
- Use `@faker-js/faker` for unique test data. Never hardcode test data.
- Support `Partial<T>` overrides for negative-test data generation.
- For missing-field tests use:

```ts
delete (
  payload as unknown as Record<string, unknown>
).fieldName;
```

- **Never place payload objects inline in spec files.**
- Always use factory functions from `src/payload/`.
- If a factory function does not exist for an endpoint, create one before writing the spec.

---

## 2.4 Custom Fixtures (`base-test.ts`)

The project extends Playwright's base test.

### Auto-fixtures (Always Active)

- `hooks`
  - ConfigReader
  - auth file pre-check
  - per-test correlation ID
  - Allure suite labels

### Manual Fixtures (Opt-in via Destructuring)

- `authApi`
  - `AuthApiService` instance
- `clientApi`
  - `ClientApiService` instance

### Example

```ts
import { expect, test } from '@base/base-test';

test.describe(TEST_SUITES.AUTH_API, () => {
  test('SA can create user', async ({ authApi }) => {
    // authApi is auto-injected
  });
});
```

> All spec files must import `test` and `expect` from `@base/base-test`, **not** from `@playwright/test`.

---

## 2.5 Constants & Enums

| Kind | Location | Import Pattern | Example |
|--------|----------|----------------|---------|
| Test suites | `src/constants/app/test-suites-constants` | `@constants/app/test-suites-constants` | `TEST_SUITES.AUTH_API` |
| API service names | N/A (not centralized in current repo) | Use service-class property `apiServiceName` | `readonly apiServiceName = 'Auth Api Service'` |
| Allure labels | `src/constants/framework/allure-constants` | `@constants/framework/allure-constants` | `ALLURE_REPORT.EPIC` |
| Timeout | `src/constants/framework/timeout-constants.ts` | `@constants/framework/timeout-constants` | `TIMEOUT.TEST_TIMEOUT` |
| HTTP status | `src/framework/http/http-status-enum.ts` | `@framework/http/http-status-enum` | `HttpStatus.OK` |
| HTTP types/constants | `src/framework/http/*` | `@framework/http/http-method-enum`, `@framework/http/http-header-constants`, `@framework/http/http-config` | `HttpMethod.POST`, `ContentType.JSON`, `HttpTimeout.LONG` |
| Test tags | `src/framework/enums/test-tags-enum.ts` | `@framework/enums/test-tags-enum` | `TestTags.SMOKE` |
| User roles | `src/framework/enums/user-roles-enum.ts` | `@framework/enums/user-roles-enum` | `UserRoles.SYSTEM_ADMIN`, `RoleId.SYSTEM_ADMIN` |

### Constant Object Convention

All constant objects use `SCREAMING_SNAKE_CASE` with `as const`:

```ts
export const TEST_SUITES = {
  AUTH_API: 'Auth Api',
  CLIENT_API: 'Client Api',
  MDM_GROUPS_API: 'MDM Groups API',
  MDM_REITS_API: 'MDM REITs API'
} as const;
```

Never hard-code string literals that are reused across files. Extract them into constants or enums.

---

## 2.6 Naming Conventions

> **ALL files and folders use kebab-case. This is non-negotiable.**

### File Naming (kebab-case with type suffix)

| Artifact | Convention | Example |
|----------|------------|---------|
| Folders | `kebab-case` | `auth-api/`, `client-api/`, `auth-test-matrices/` |
| API Services | `kebab-case-service.ts` | `auth-api-service.ts`, `base-api-service.ts` |
| Spec Files (Functional) | `NN.<domain>-api.<httpmethod>.<action>.<entity>.spec.ts` | `02.auth-api.post.manage.analytics-entitlement.spec.ts` |
| Spec Files (Security) | `NN.<domain>-api.<httpmethod>.<action>.<entity>.security.spec.ts` | `01.auth-api.post.manage.analytics-entitlement.security.spec.ts` |
| Payload Factories | `kebab-case.payload.ts` | `auth.payload.ts`, `client.payload.ts` |
| Test Matrices | `kebab-case-matrix.json` | `create-system-admin-role-matrix.json` |
| Constants | `kebab-case-constants.ts` | `test-suites-constants.ts`, `timeout-constants.ts` |
| Enums | `kebab-case-enum.ts` | `user-roles-enum.ts`, `test-tags-enum.ts` |
| Helpers | `kebab-case.ts` or `kebab-case-helper.ts` | `api-helper.ts`, `token-builders/expired-token-builder.ts` |
| Models | `kebab-case.response.ts` or `kebab-case.types.ts` | `auth-user.response.ts`, `test-matrix-types.ts` |
| Test Cases (Functional) | `N.<domain>-api.<httpmethod>.<action>.<entity>-functional.md` | `1.auth.api.post.manage.analytics-entitlement-functional.md` |
| Test Cases (Security) | `N.<domain>-api.<httpmethod>.<action>.<entity>-security.md` | `1.auth.api.post.manage.analytics-entitlement-security.md` |

---

### Code Naming

| Artifact | Convention | Example |
|----------|------------|---------|
| Classes | `PascalCase` | `AuthApiService`, `BaseApiService`, `TokenService` |
| Interfaces / Types | `PascalCase` | `TestMatrix`, `SystemAdminPayload`, `UserResponse` |
| Enums | `PascalCase` | `UserRoles`, `TestTags`, `HttpStatus`, `HttpMethod` |
| Enum Members | `SCREAMING_SNAKE_CASE` | `SYSTEM_ADMIN`, `SMOKE`, `REGRESSION` |
| Constant Objects | `SCREAMING_SNAKE_CASE` | `TEST_SUITES`, `TIMEOUT`, `API_ENDPOINTS`, `MATRIX_PATHS` |
| Factory Functions | `camelCase` with `create` prefix | `createSystemAdminPayload`, `createClientPayload` |
| Variables | `camelCase` | `userGuid`, `expectedStatusCode`, `clientId` |
| Private Fields | `camelCase` | `request`, `apiHelper`, `tokenService` |

---

## 2.7 Test Suite Structure (STRICT)

```ts
import { expect, test } from '@base/base-test';
import { TEST_SUITES } from '@constants/app/test-suites-constants';
import { ALLURE_REPORT } from '@constants/framework/allure-constants';
import { TestTags } from '@framework/enums/test-tags-enum';
import { MatrixLoader } from '@test-matrices/matrix-loader';
import { MATRIX_PATHS } from '@test-matrices/matrix-paths';
import { label } from 'allure-js-commons';

test.describe(TEST_SUITES.<DOMAIN_CONSTANT>, () => {

  // 1. Load matrix at suite level
  const testMatrix =
    MatrixLoader.loadMatrixFile<TestMatrix>(
      MATRIX_PATHS.<DOMAIN>.<MATRIX>
    );

  // 2. Allure labels in beforeEach
  test.beforeEach(async () => {
    label(ALLURE_REPORT.EPIC, '<Epic Name>');
    label(ALLURE_REPORT.FEATURE, '<Feature Name>');
    label(ALLURE_REPORT.STORY, '<Story Name>');
  });

  // 3. Matrix-driven test loops (one per scenario category)
  for (const { userRole, expectedStatusCode }
    of testMatrix.tests.<key>) {

    test(
      `${userRole} can/cannot <action>`,
      { tag: [...] },
      async ({ authApi }) => {
        // test body
      }
    );
  }

  // 4. Expired token tests (ALWAYS at the end)

});
```

---

### 2.7.1 Allure Metadata Standard (MANDATORY)

**Authority:** All spec files MUST declare a consistent Allure hierarchy in `test.beforeEach(...)` so reports, dashboards, and traceability roll up predictably.

Any deviation is a governance finding.

### Allure Hierarchy Mapping

| Allure Field | Meaning | Functional Example | Security Example |
|-------------|---------|-------------------|-----------------|
| Epic | API type / product area | `Auth API` | `Auth API` |
| Feature | Module under test | `Analytics Entitlement` | `Analytics Entitlement` |
| Story | Business capability / test scope | `Manage Analytics Entitlement` | `Manage Analytics Entitlement - Security Compliance Tests (SASP)` |

### Rules

- Epic MUST be the domain/API type:
  - `Auth API`
  - `Client API`
  - `REIT API`
  - `Report API`
  - `Trial Balance API`
- Use value from:
  ```ts
  TEST_SUITES.<DOMAIN>
  ```

- Feature MUST be the module name:
  - `Analytics Entitlement`
  - `System Administrator`
  - `Client`
- Prefer a file-scope `MODULE_NAME` constant when repeated.

- Story MUST describe the business capability under test.
- Functional specs use the closest business-capability phrase.
  Example:
  ```text
  Export Groups Data
  ```

- For paired security specs, reuse the functional story and append the required security suffix.

- Paired functional and security specs MUST use identical:
  - Epic
  - Feature

- Story values may differ only by the security suffix.

- Labels MUST be set in:
  ```ts
  test.beforeEach(...)
  ```
  and not inline inside individual `test(...)` methods.

- Always use:

  ```ts
  ALLURE_REPORT.EPIC
  ALLURE_REPORT.FEATURE
  ALLURE_REPORT.STORY
  ```

  from:

  ```ts
  @constants/framework/allure-constants
  ```

- Never hard-code label keys.

---

### Functional Example

```ts
test.beforeEach(async () => {
  label(ALLURE_REPORT.EPIC, 'Auth API');
  label(ALLURE_REPORT.FEATURE, 'Analytics Entitlement');
  label(ALLURE_REPORT.STORY, 'Manage Analytics Entitlement');
});
```

### Security Example

```ts
test.beforeEach(async () => {
  label(ALLURE_REPORT.EPIC, 'Auth API');
  label(ALLURE_REPORT.FEATURE, 'Analytics Entitlement');
  label(
    ALLURE_REPORT.STORY,
    'Manage Analytics Entitlement - Security Compliance Tests (SASP)'
  );
});
```

# 2.8 Test Title Format (STRICT)

## Format

```text
${userRole} can/cannot <verb> <entity> [with <condition>]
```

### Rules

- Use `can` for positive (happy-path) tests.
- Use `cannot` for negative (unauthorized, invalid, restricted) tests.
- Use the full role name from the matrix (e.g., `System Administrator`, not `SA`).
- Keep titles concise but descriptive.

### Examples

```ts
${userRole} can create a system administrator user with allowed internal domain
${userRole} cannot create a system administrator user
${userRole} cannot create a system administrator with missing userid
${userRole} cannot create a system administrator with expired token
${userRole} can create a TAX client
${userRole} cannot create a client with missing mandatory field
```

---

# 2.9 Test Tagging

Available tags from `TestTags` enum:

| Enum Member | Value | Purpose |
|-------------|--------|----------|
| `TestTags.SMOKE` | `@smoke` | Critical-path tests (happy path + RBAC unauthorized + expired token) |
| `TestTags.REGRESSION` | `@regression` | ALL tests get this tag |
| `TestTags.AUTH_API` | `@authApi` | Auth domain tests |
| `TestTags.CLIENT_API` | `@clientApi` | Client domain tests |

## Rules

- Every test **must** have `TestTags.REGRESSION` plus the domain tag.
- Critical paths (happy path, RBAC denial, expired token) also get `TestTags.SMOKE`.
- Validation/BVA/injection tests get `TestTags.REGRESSION` plus domain tag only (no SMOKE).
- Security specs (`*.security.spec.ts`) **must** use exactly one tag:

```ts
[TestTags.SECURITY]
```

- Do not add `REGRESSION`, `SMOKE`, domain, role, or any other tag to security specs.

---

# 2.10 Test Steps

Wrap every logical step inside `test.step()` with a clear description.

**Every `test.step()` MUST be preceded by a numbered inline comment** that describes the step purpose.

Use:

- `// Pre-cleanup` for arrange/pre-condition steps.
- `// Step 2:`
- `// Step 3:`
- etc. for all subsequent steps.

## Example

```ts
// Pre-cleanup
await test.step(
  `Ensure no existing System Admin user for ${userRole}`,
  async () => {
    ...
  }
);

// Step 2: Create new System Admin user for the specified role
await test.step(
  `Create a new System Admin user by ${userRole}`,
  async () => {
    ...
  }
);

// Step 3: Cleanup created System Admin user
await test.step(
  `Cleanup: Delete the System Admin user created for ${userRole}`,
  async () => {
    ...
  }
);
```

## Rules

- The first step (arrange/pre-condition) uses `// Pre-cleanup` (no number).
- Subsequent steps use `// Step N: <action description>` format starting from Step 2.
- The description after the colon should clearly state what the step does.
- Cleanup steps in `finally` blocks also receive numbered comments.

---

# 2.10-A External Temp User Functional Test Isolation (MANDATORY)

- Keep External Temp User (`XT` / `UserRoles.EXTERNAL_TEMP_USER`) coverage in the same functional spec file as the endpoint's other role coverage.
- Do not create a separate spec file solely for XT.
- Define XT scenarios under a dedicated matrix key and in a separate `test(...)` block.
- Never include XT in a shared EA/EU/XR role loop or matrix-driven test block.
- Preserve the XT matrix value as the expected status.
- Perform every required pre-condition, data lookup, setup, verification outside the tested XT action, and cleanup as `UserRoles.SYSTEM_ADMIN`.
- Use XT credentials only for the single action whose authorization or behaviour is under test.
- Keep cleanup in `finally` and execute it as `UserRoles.SYSTEM_ADMIN`, including when the XT action is expected to fail.
- When a matrix contains EA/EU/XR/XT entries, filter or split the XT entry into its own test block while preserving matrix-driven expected status values.
- When XT expects `HttpStatus.UNAUTHORIZED`, create or reuse a dedicated API-service method that sends:

```ts
getExternalTempUserHeader("expired")
```

as the complete Authorization header via:

```ts
SecurityRequestHelper.sendWithHeaders(...)
```

or an equivalent custom-header request that does not retry authentication.

- Keep header construction out of the spec.
- Never send an XT 401 scenario through:

```ts
ApiHelper.sendRequest(...)
```

because its 401 recovery invokes unsupported role regeneration.

- Never pass the complete XT checklist header to:

```ts
sendRequestWithToken(...)
```

because that method prefixes `Bearer`.

- Assert the returned status through the endpoint assertion module using the matrix-provided `expectedStatusCode`.
- Verify as System Administrator that a rejected mutating action persisted no data.

---

# 2.10.1 Test Case Banner Standard (MANDATORY)

## Authority

Every `test(...)` in every functional and security spec **MUST** be immediately preceded by a structured banner comment that captures:

- Intent
- Traceability
- Role
- Endpoint
- Objective
- Expected Behaviour

A missing, partial, or malformed banner is a governance finding under:

```text
.github/config/consistency-policy.md
```

---

## Purpose

A reviewer must be able to read the banner alone and answer:

### Functional

- WHAT feature?
- WHICH role?
- WHICH business rule?
- WHAT expected result?

### Security

- WHAT attack?
- WHICH SASP category?
- WHICH role/security context?
- WHAT secure behaviour is expected?

---

## Common Rules

- Banner starts and ends with a line of 88 `=` characters prefixed by `//`.
- Field labels are left-aligned in a fixed-width column so all `:` characters align.
- Test Case `<ID>` must match the ID in the paired test-case markdown file.
- When the test is matrix-driven and iterates roles, the `Role` field states the matrix key.

Example:

```text
Matrix: manageAnalyticsEntitlement
```

not a single role.

- Banners describe intent only.
- Do not restate the code that follows.

---

## Functional Banner (Positive & Negative)

### Positive Functional Example

```ts
// ========================================================================================
// Test Case 1
// Scenario    : System Administrator can create Analytics Entitlement
// Requirement : AC-001
// Role        : System Administrator
// API         : POST /analytics-entitlement
// Objective   : Verify user can create an entitlement with valid data
// Expected    : 201 Created and entitlement returned successfully
// ========================================================================================

test("System Administrator can create Analytics Entitlement", async () => {
  /* ... */
});
```

### Negative Functional Example

```ts
// =====================================================================================
// Test Case 5
// Scenario    : System Administrator cannot create Analytics Entitlement with duplicate code
// Requirement : BR-05
// Role        : System Administrator
// API         : POST /analytics-entitlement
// Objective   : Verify duplicate values are rejected
// Expected    : 409 Conflict
// =====================================================================================
```

### RBAC Banner Example

```ts
// ======================================================================================
// Test Case 10
// Scenario    : Engagement User cannot delete Analytics Entitlement
// Requirement : RBAC-01
// Role        : Engagement User
// API         : DELETE /analytics-Entitlement/{id}
// Objective   : Verify unauthorized role cannot perform delete operation
// Expected    : 403 Forbidden
// =====================================================================================
```

### Functional Field Order (MANDATORY)

```text
Test Case
Scenario
Requirement
Role
API
Objective
Expected
```

---

# Security Banner (SASP)

Security banners replace `Scenario` and `Requirement` with

- `SASP ID`
- `Category`
- `Attack`

Security banners MUST appear b*fore every `test(...)` in a `*.security.spec.ts` file.

### Security Banner Example

```ts
// =====================================================================================
// Security Test Case 1
// SASP ID    : SASP-01
// Category   : SQL Injection
// Role       : System Administrator
// API        : POST /analytics-entitlement
// Attack     : SQL Injection Payload
// Objective  : Verify API safely handles SQL injection attempts
// Expected   : Safe rejection or safe processing without server failure
// ========================================================================================
```

---

## Additional SASP Examples

### Authentication Bypass

```ts
// ========================================================================================
// Security Test Case 3
// SASP ID    : SASP-05
// Category   : Authentication Bypass
// Role       : Anonymous User
// API        : GET /analytics-entitlement
// Attack     : Missing Authorization Header
// Objective  : Verify unauthenticated access is rejected
// Expected   : 401 Unauthorized
// ========================================================================================
```

### Token Abuse

```ts
// ========================================================================================
// Security Test Case 4
// SASP ID    : SASP-06
// Category   : Token Abuse
// Role       : System Administrator
// API        : GET /analytics-entitlement
// Attack     : Tampered JWT Token
// Objective  : Verify tampered tokens are rejected
// Expected   : 401 Unauthorized or 403 Forbidden
// ========================================================================================
```

Additional SASP examples such as:

- XSS
- Authentication Bypass
- Token Abuse
- CRLF
- CORS

must follow the same field order.

---

## Security Field Order (MANDATORY)

```text
Security Test Case
SASP ID
Category
Role
API
Attack
Objective
Expected
```

---

## SASP ID Rule

The `SASP ID` value MUST also appear at the beginning of the test title.

Example:

```ts
test(
  "SASP-01: System Administrator cannot create Analytics Entitlement with SQL injection",
  async () => {
    ...
  }
);
```

This ensures:

- Allure titles stay synchronized with banner IDs.
- Security test traceability is preserved.

---

## Enforcement

### Generator (O6)

Must:

- Emit the appropriate banner before every `test(...)`.
- Populate all fields.
- Never leave placeholders such as `TBD`.
- Never leave blank values.

### Reviewers (O7 - O10)

Must reject any spec that:

- Is missing a banner.
- Uses an incorrect field order.
- Uses a functional banner in a security spec.
- Uses a security banner in a functional spec.

### Debugger (O9)

Must NOT:

- Delete banners while fixing failing tests.
- Shrink banner content.

If the intent changes:

1. Update the banner.
2. Update the paired test-case markdown.
3. Keep banner and implementation synchronized.

---

# 2.11 Clean-Run-Clean Pattern (STRICT)

Every test must be independently runnable:

1. **Arrange**  
   Check for pre-existing entity and clean-state data.

2. **Act**  
   Execute the API operation.

3. **Assert**  
   Validate response status, body, and business rules.

4. **Cleanup**  
   Delete/restore test entities in a `finally` block.

## Example

```ts
test(`${userRole} can create a system administrator user`, async ({ authApi }) => {
    let userGuid: string | null = null;
    const payload = AddUserPayload.createSystemAdminPayload();

    // Pre-cleanup
    await test.step(
        `Ensure no existing System Admin user for ${userRole}`,
        async () => {
            const result = await authApi.checkIfSystemAdminUserExists(
                userRole,
                payload.userId,
                HttpStatus.OK
            );

            userGuid = result.guid;

            if (userGuid) {
                await authApi.deleteSystemAdminUser(
                    userRole,
                    userGuid,
                    HttpStatus.NO_CONTENT
                );
            }
        }
    );

    try {
        // Step 2: Create new System Admin user for the specified role
        await test.step(
            `Create a new System Admin user by ${userRole}`,
            async () => {
                const response = await authApi.addUser(
                    userRole,
                    payload,
                    expectedStatusCode
                );

                userGuid = response?.guid || null;
            }
        );
    } finally {
        // Step 3: Cleanup created System Admin user
        await test.step(
            `Cleanup: Delete the System Admin user created for ${userRole}`,
            async () => {
                if (userGuid) {
                    await authApi.deleteSystemAdminUser(
                        userRole,
                        userGuid,
                        HttpStatus.NO_CONTENT
                    );
                }
            }
        );
    }
});
```

---

# 2.12 Assertion Patterns

**Response validation** belongs to assertion modules under:

```text
src/assertions/
```

Specs orchestrate these assertions with expected values from the matrix or test design.

Services should return actual response/result data only.

Reusable status, header, body, business-rule, and schema-backed checks must **not** be implemented in services or inline within specs.

For intentional raw-request security probes, specs invoke:

```ts
SecurityAssertions.assertExpectedSecurityStatus(...)
```

This remains an assertion-layer API and routes mismatches to the detailed API failure format.

---

## 2.12.1 Security Assertion Rule (MANDATORY)

```text
src/assertions/security-assertions.ts
```

is the centralized security assertion layer and the single source of truth for:

- Security status-code validation
- Security probe validation
- Response-header validation
- Leakage validation

across all `*.security.spec.ts` files.

All security test scripts **must** use `SecurityAssertions` for security-related assertions.

### Security Specs MAY contain

- Test scenario flow
- Test data selection
- Service method calls
- Calls to `SecurityAssertions`

### Security Specs MUST NOT contain

- Inline `expect(status).toBe(...)` security status validation
- Inline allowed-status arrays
- Inline required-security-header loops
- Inline forbidden-header loops
- Inline leakage-pattern loops
- Inline regex checks for sensitive or error leakage
- Duplicated CRLF injected-header validation
- Duplicated security probe handling logic

---

## Required Assertion APIs

```ts
assertExpectedSecurityStatus()
```

Auth/RBAC/token denial status validation

```ts
assertSecurityProbeStatus()
```

Attack payload status validation

```ts
assertSecurityProbeSafe()
```

Attack payload status + leakage validation

```ts
assertRequiredResponseHeaders()
```

Required security response headers

```ts
assertNoForbiddenResponseHeaders()
```

Forbidden response headers

```ts
assertNoLeakage()
```

Sensitive or error leakage validation

```ts
assertNoInjectedResponseHeader()
```

CRLF injected-header validation

---

## Centralized Failure Reporting (MANDATORY)

Security failure report formatting is centralized in:

```text
security-assertions.ts
```

All SASP attack-probe tests must call:

```ts
SecurityAssertions.assertSecurityProbeSafe()
```

and pass a populated:

```ts
SecurityAssertionContext
```

containing:

```ts
{
  saspId,
  category,
  module,
  httpMethod,
  role,
  payload,
  responseBody
}
```

### Security specs MUST NOT

- Build custom failure messages
- Implement inline status validation
- Implement inline leakage validation
- Create Jira-style summaries directly inside spec files

### Enterprise Layering

```text
Spec                 = WHAT to test
SecurityAssertions   = WHAT to verify and HOW to report failures
Logger               = HOW to format/log framework-level failure output
```

---

## Standard API Failure Structure (MANDATORY)

Assertion modules must route API status mismatches and API-flow validation failures through:

```ts
Logger.handleError(...)
```

so failures are emitted in the standardized format.

### Standard Failure Format

```text
❌ API TEST FAILURE — ${errorSummary}

ℹ️ General Info
🔗 Correlation ID

🌐 HTTP Method
➡️ URL

📌 Status Comparison
✅ Expected
❌ Actual

🔒 Context
➡️ Performed By
➡️ ClientId

📥 Request Payload
📤 Response Body

💥 Root Cause
```

### Required Details Passed To Logger.handleError(...)

```ts
{
  httpMethod,
  url,
  correlationId,
  expectedStatus,
  actualStatus,
  performedBy,
  clientId (when available),
  requestPayload (when available),
  responseBody (when available),
  rootCause,
  errorSummary
}
```

## Standard API Failure Structure (MANDATORY)

Required context details for:

```ts
SecurityAssertions.assertExpectedSecurityStatus(...context)
```

in raw security scenarios:

- `httpMethod`
- `url`
- `role`
- `payload` (when available)
- `responseBody` (when available)
- explicit `expectedStatus` for strict deny assertions

### Hard Assertions (Default)

Hard assertions must always include failure messages.

```ts
expect(
  userGuid,
  "User should NOT be created with an invalid email"
).toBeNull();

expect(
  clientId,
  "Client ID should not be null after creation"
).not.toBeNull();
```

### Soft Assertions (Response Header Validation Only)

```ts
expect.soft(
  contentType,
  "Content-Type must be application/json"
).toContain("application/json");
```

### Error Message Validation

```ts
expect(response?.errorMessage).toContain(
  "already exist in the system"
);

expect(response?.success).toBe(false);
```

---

# 2.13 User Roles

| Role | Enum Value | Access Level |
|--------|--------|--------|
| System Administrator | `UserRoles.SYSTEM_ADMIN` | Full system access |
| Engagement Administrator | `UserRoles.ENGAGEMENT_ADMIN` | Manages engagements, clients, users |
| Engagement User | `UserRoles.ENGAGEMENT_USER` | Standard user |
| External Checklist User | `UserRoles.EXTERNAL_CHECKLIST_USER` | External user for checklists |
| External Temp User | `UserRoles.EXTERNAL_TEMP_USER` | Temporary external user (uses checklist token, not browser auth) |

---

# 2.14 Domain-Specific Cleanup Patterns

## Auth Domain - Delete

```ts
if (userGuid) {
  await authApi.deleteSystemAdminUser(
    userRole,
    userGuid,
    HttpStatus.NO_CONTENT
  );
}
```

---

## Client Domain - Inactivate (No Delete Endpoint)

```ts
const inactiveClient =
  CreateClientPayload.createClientPayload({
    isActive: false,
    id: clientId ?? undefined,
  });

if (clientId) {
  await clientApi.updateClient(
    userRole,
    inactiveClient,
    HttpStatus.OK
  );
}
```

---

## MDM Groups - Lookup Then Delete

```ts
const groupDetails =
  await mdmGroupsApiService.getGroupDetailsIfExist(
    userRole,
    clientId,
    HttpStatus.OK
  );

const createdGroupId =
  await mdmGroupsApiService.getEntityGroupIdIfExist(
    payload.EntityGroupName!,
    groupDetails
  );

if (createdGroupId) {
  await mdmGroupsApiService.deleteEntityGroup(
    userRole,
    clientId,
    createdGroupId,
    HttpStatus.OK
  );
}
```

---

# 2.15 Expired Token Tests (MANDATORY)

Functional spec files must include expired token tests at the end of the `test.describe` block.

---

## Pattern - Matrix-Driven Per-Role Iteration (Functional Specs Only)

```ts
for (const { userRole, expectedStatusCode } of testMatrix.tests.<scenarioKey>) {
  test(
    `${userRole} cannot create a system administrator with expired token`,
    { tag: [...] },
    async ({ authApi }) => {
      const tokenService = TokenService.getInstance();

      const realToken =
        await tokenService.getAuthToken(userRole);

      const expiredToken =
        expireRealToken(realToken);

      await test.step(
        `Attempt with expired token as ${userRole}`,
        async () => {
          const actualStatus =
            await authApi.<serviceMethod>WithToken(
              expiredToken,
              expectedStatusCode as HttpStatus,
              userRole
            );

          expect(
            actualStatus,
            "Expired token must return expected status"
          ).toBe(expectedStatusCode);
        }
      );
    }
  );
}
```

### Note

Security specs (`*.security.spec.ts`) are excluded from this matrix-loop requirement and should follow SASP-oriented security orchestration patterns.

---

## Pattern - External Temp User (Checklist Token Functional-Spec Usage)

```ts
test(
  `${UserRoles.EXTERNAL_TEMP_USER} cannot create with expired token`,
  async ({ request }) => {
    const expiredHeader =
      getExternalTempUserHeader("expired");

    // ...
  }
);
```

---

# 2.16 Security Test Categories

Security spec files:

```text
tests/<domain>-api/<feature-folder>/
```

must cover:

| Category | Description |
|-----------|------------|
| Expired token (SA only) | `buildExpiredTokenFromJwt()` (or alias `expireRealToken`) for the System Administrator bearer token |
| Missing Authorization Header | Direct `request.post()` without auth header |
| Malformed/Tampered Tokens | Garbage string, truncated JWT, empty bearer |
| Empty Request Body | `{}` and `null` payloads |
| SQL Injection in Fields | SQL payloads in text/email inputs |
| XSS Payload in Fields | Script injection in text inputs |
| HTML Tags in Fields | HTML tag injection in text inputs |

---

# 2.17 JSDoc Comments

Every class, public method, and exported function must have a JSDoc comment.

## Example

```ts
/**
 * Creates a new system administrator user via the Auth API.
 *
 * @param userRole - The role performing the action (for token-based auth)
 * @param payload - The user creation payload
 * @param expectedStatusCode - Expected HTTP status code
 *
 * @returns The created user response
 */
async addUser(
  userRole: string,
  payload: object,
  expectedStatusCode: number
): Promise<UserResponse> {
  ...
}
```

---

# 2.18 Shared Test Data Package (@reitsuite-qe/test-data)

Before creating new validation test data, check whether*

```ts
@reitsuite-qe/test-data
``*

already provides it.

| Module |Exports | Use When |
|----------|----------|----------|
| `email-validation-constants` | `EMAIL_VALIDATION_TESTDATA`, `buildPositiveEmailCases()`, `buildNegativeEmailCases()`* `ALLOWED_INTERNAL_DOMAINS` | Emai* field validation |
| `phone-validation-constants` | `PHONE_VALIDATION_TESTDATA`, `buildPhoneValidationTestData()` | Phone field validations|
| `field-validation-generator` |*`FieldType`, `generateInputByType(*`, `buildFieldValidationTestData()* | Generic field validation |
| `client-field-configs-constants` | `CLIENT_FIELD_CONFIGS`, `CLIENT_REQUIRED_FIELDS` | Client form field validation |

---

# 2.19 Response Contract Validation

Use:

```ts
assertStandardHeaders()
```

from:

```ts
@helpers/api/response-validator
`*`

for contract validation.

## Example

```ts
import { assertStandardHeaders }
  from "@helpers/api/response-validator";

assertStandardHeaders(
  response,
  "CreateSystemAamin"
);
```

This validates:

- Content-Type
- Cache-Control
- X-Corralation-Id

using soft assertions.
----

# 2.20 Error Handling & Resilience

- Wrap cleanup in `finally` *locks to ensure test data is cleaned even on failure.
- Use descriptive failure messages in all `expect(*` calls.
- Use `try/finally` instead of `try/catch` when cleanup is the only concern.
- Log contextual information (role, endpoint, step name) for debugging.
- Use `Logger.info()`, `Logger.success()`, and `Logger.warn()` for structured logging.*- Assertion modules must use `Logger.handleError(...)` for API status mismatches instead of throwing raw`Error`.
- API services must return failure context without asserting validating, or formatting assertion failures.
- Do not bypass the standardized API failure format for API assertion failures.

---

# 2.21 API URL Construction (STRICT)

API URLs are constructed by combining base URL from:

```ts
Config
```
*with endpoint paths from current domain constants under:

```text
src/constants/app/**
```

## Endpoint Mapping

| Domain | Endpoint Constant | File |
|----------|----------|----------|
| Auth API | `API_ENDPONNTS.AUTH` | `src/constants/app/auth/auth-endpoints-constants.ts` |
| Client API | `API_ENDPOINTS.CLIENT`| `src/constants/app/client/client-endpoints-constants.ts` |
| MDM Groups | `MDM_GROUPS_API_ENDPOINTS.MDM_GROUPS` | `src/constants/app/reits/mdm/groups/mdm-groups-endpoints-constants.ts` |
| MDM REITs | `MDM_REIT_API_ENDPOINTS.MDM_REITS` | `src/constants/app/reits/mdm/reits/mdm-reits-endpoints-constants.ts` |

##Example

```ts
import { Config } from "@config/config";

import {
  API_ENDPOINTS as AUTH_ENDPOINTS
} from "@constants/app/auth/auth-endpoints-constants";

import {
  API_ENDPOINTS as CLIENT_ENDPOINTS
} from "*constants/app/client/client-endpoints-constants";

import {
  MDM_GROUPS_API_ENDPOINTS
} from "@constants/app/reits/mdm/groups/mdm-groups-endpoints-constants";

import {
  MDM_REIT_API_ENDPOINTS
} from "@constants/app/reits/mdm/reits/mdm-reits-endpoints-constants";

const authUrl =
  `${Config.authApiUrl}${AUTH_ENDPOINTS.AUTH.AUTHORIZATION}`;

const clientUrl =
  `${Config.clientApiUrl}${CLIENT_ENDPOINTS.CLIENT.CLIENT_BASE}`;

const mdmGroupsUrl =
  `${Config.reitApiUrl}${MDM_GROUPS_API_ENDPOINTS.MDM_GROUPS.MASTER_DATA_MANAGEMENT}${MDM_GROUPS_API_ENDPOINTS.MDM_GROUPS.ADD_ENTITY_GROUP}`;

const mdmReitsUrl =
  `${Config.reitApiUrl}${MDM_REIT_API_ENDPOINTS.MDM_REITS.REITS_BASE}${MDM_REIT_API_ENDPOINTS.MDM_REITS.CREATE_REIT}`;
```

## Rules

- `Config.*ApiUrl` already contains the full service base URL.
- Endpoint constants must provide path fragments that can be composed safely.
- Never hardcode full API URLs in specs.
- Reuse domain constant files and do not duplicate paths across services/specs.
- Spec files MUST NOT construct, concatenate, store, or import API URLs, base URLs, or endpoint constants. Specs MUST NOT import `Config`, `API_ENDPOINTS`, or any URL builder.
- Spec files MUST NOT instantiate API services, `ApiHelper`, or `TokenService`, or call Playwright `request` methods directly. API operations must use fixture-exposed services (`Spec -> Fixture -> Service`).
- Spec files MUST NOT declare module-scoped or `test.describe` scoped business, request, assertion, parsing, transformation, or reusable helper functions. This includes function declarations and arrow-function helpers such as `logLoginEventAndAssert`.
- Playwright callbacks required by `test.describe`, `test`, hooks, and `test.step` are the only function bodies that belong in specs. Specs orchestrate existing fixtures, service methods, payload factories, and assertion APIs directly inside those callbacks.
- Move endpoint execution and reusable API workflows to `src/api-services/` and expose them through fixtures.
- Move response and business validation to `src/assertions/`.
- Move payload creation or mutation to `src/payload/`.
- Move genuinely generic pure utilities to `src/helpers/`.
- During generation, review, or debugging, treat a local spec helper as an architecture violation and refactor it to the owning layer before completion. Do not retain it merely to reduce repeated lines in one spec.

---

# 2.22 Zod Response Schema Pattern

Use Zod for response contract validation.

Define schemas in:

```text
src/framework/models/
```

## Status-Aware Schema Application (MANDATORY)

- Preserve and return the actual HTTP status and raw response body before applying a body schema so status assertions always run.
- Apply a success-response schema only to body-bearing `2xx` responses.
- Never apply success schemas to `4xx`/`5xx` authentication, authorization, or error envelopes.
- Validate a non-success body only with a dedicated error schema documented for that status.
- Otherwise retain a typed/raw error representation for assertion-layer diagnostics.
- Never catch or replace an actual status mismatch by relaxing a matrix expectation.
- The assertion layer must compare the matrix/contract expectation with the actual status first and classify any mismatch.

## Example

```ts
import { z } from "zod";

export const EntityResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  isActive: z.boolean(),
});

export type EntityResponse = z.infer<typeof EntityResponseSchema>;

export const EntityErrorResponseSchema = z.object({
  errorMessage: z.string(),
  success: z.boolean(),
});
```