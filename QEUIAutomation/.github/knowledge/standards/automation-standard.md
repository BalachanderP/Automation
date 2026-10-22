---
title: REITSuite Enterprise API Automation Standard
name: REITSuite Enterprise API Automation Standard
version: 1.1.0
owner: REITSuite QE Automation
lastReviewed: 2026-09-11
standard: EY Enterprise QA Automation Standard
status: Active
type: Knowledge
ssotFor: Golden Rule, per-layer include/exclude lists, review verdict model, three-audience rule
appliesTo: All API automation artifacts (specs, services, payload builders, assertions, schemas, models, matrices, reporters, helpers, security artifacts)
---

# REITSuite Enterprise API Automation Standard

Authoritative enterprise standard for generating, reviewing, and improving production-ready Playwright TypeScript API automation artifacts in the REITSuite/QEAPI framework.

> **SSoT precedence:** Where this file overlaps with `coding-standards.md`, `test-standards.md`, or `architecture.md`, those domain SSoTs remain authoritative for their decision areas. This file is authoritative for the enterprise principles, output behavior, review verdict model, non-negotiable rules, and golden-audience rule defined below. Where it overlaps with `consistency-policy.md`, the consistency policy wins.

---

## 1. Role and Core Objective

Act as a Principal QE Architect and Playwright TypeScript API Automation Expert. Generate or review production-ready Playwright TypeScript API automation artifacts using enterprise standards. Produce deterministic, clean, maintainable, contract-first, matrix-driven, service-layer-based automation.

Never expose internal reasoning, file-reading logic, routing decisions, or implementation analysis. Only provide the final requested output.

**Support:**

1. Functional API test design
2. Security API test design
3. Spec file review
4. Matrix-driven test generation
5. Service-layer-based automation
6. Payload-builder-based request creation
7. Zod schema contract validation
8. Centralized assertion usage
9. RBAC validation across roles
10. SASP security compliance validation
11. Performance and SLA validation when defined
12. Maintainable enterprise architecture
13. Functional test case documentation
14. Security test case documentation
15. Required supporting artifact generation
16. Enterprise import review
17. Enterprise code quality review
18. Security coverage gap analysis
19. Method-wise applicability analysis
20. Deterministic output behavior

---

## 2. Mandatory Enterprise Principles

1. Contract-first testing
2. Thin spec pattern
3. Service-layer pattern
4. Payload builder pattern
5. Centralized assertion pattern
6. Shared test data usage
7. Matrix-driven execution
8. Clean-Run-Clean test isolation
9. Deterministic test behavior
10. No hardcoded values when constants, enums, builders, or shared data exist
11. No duplicate utilities
12. Reuse existing framework utilities before creating new code
13. Generate only applicable test scenarios
14. Keep functional and security coverage separate
15. Do not duplicate functional tests in security specs
16. Validate successful responses using schema contracts
17. Validate business outcomes, not only response presence
18. Use meaningful assertion failure messages
19. Use descriptive Allure-friendly test names
20. Remove unused imports
21. Respect **Enterprise QA Standard > Business Rules Registry > Status Code Policy Registry > Runtime Evidence** status precedence
22. Do not change expected status only because runtime behavior is incorrect
23. Do not expose internal reasoning to the user
24. Generate production-ready artifacts when asked for code
25. Ask only for missing critical information when required; otherwise infer from contract, existing framework, matrix, and source artifacts

### 2.1 Agent Behavior Standard

The agent must:

1. Prefer existing framework implementations.
2. Search for reusable artifacts before generating new artifacts.
3. Justify creation of new framework components.
4. Never create duplicate services, builders, assertions, schemas, or helpers.
5. Follow Reuse -> Extend -> Create.
6. Resolve uncertainty using enterprise policy, business requirements, Swagger/OpenAPI, source code, framework artifacts, and matrices before asking the user.

If critical information is still missing after this resolution flow, ask one focused question for the exact missing input.

---

## 3. File Responsibility Model (Golden Rule)

- **Spec** = WHAT to test
- **Service** = HOW to call the API
- **Payload Builder** = WHAT to send
- **Assertions** = WHAT to verify
- **Schema** = WHAT the contract looks like
- **Model** = WHAT the data looks like
- **Matrix** = WHICH combinations to run
- **Reporter** = HOW evidence is captured
- **Helper** = Generic reusable utilities

### 3.1 Spec File

**May include:** test scenarios, execution flow, test data selection, matrix-driven loops, assertion invocation, RBAC role verification, business rule verification, security verification calls, contract validation calls, response verification calls, schema validation calls, test tags, Allure metadata, `test.describe()`, `test.step()`, calls to services, calls to payload builders, calls to assertions.

**Must not include:** endpoint URLs, HTTP implementation, request construction, header creation, authentication handling, token management, retry verification, security failure classification, report formatting.

### 3.2 Service File

May include: endpoint paths, HTTP methods, API request execution, query/route parameters, header setup, authentication, token injection, correlation IDs, retry handling, logging, `ApiHelper` usage, request/response mapping, response parsing/wrapping, error translation, raw response methods when required for header/security/status validation.

Must not include: Playwright test blocks, assertions, matrices, business validation, scenario-specific validation, tags, Allure metadata, contract validation, RBAC validation, security validation, severity decisions, defect classification, Jira formatting, payload factories.

Expected-status validation stays out of services unless the existing framework service pattern already owns it.

### 3.3 Payload Builder

May include: request body creation, dynamic test data, overrides, cloning, transformation, normalization, valid/invalid/boundary/duplicate payload generation, security payload mutation when applicable, state-driven payload generation, deterministic generation.

Must not include: API calls, assertions, execution, business validation, response validation, service calls, reporting, status handling, security classifications.

### 3.4 Assertion File

May include: response/business/security/RBAC assertions, state comparison, field validation, error response validation, contract assertion orchestration, header/Content-Type/SLA/data-integrity/duplicate/non-mutation validation, reusable validation logic.

Must not include: API calls, request execution, test blocks, test data generation, payload creation, authentication, retry, Allure metadata, tags, matrix loading, report layout formatting.

### 3.5 Schema File

May include: Zod schemas, OpenAPI schema mappings, request/response/error contract definitions, type-safe parsing, nullability, enum constraints, property types.

Must not include: API calls, business rules, test logic, assertions, Playwright code.

### 3.6 Model File

May include: DTOs, interfaces, type definitions, domain models, enum definitions.

Must not include: business logic, API logic, validation logic, test logic.

### 3.7 Matrix File

May include: user roles, expected status codes, scenario names/data, RBAC combinations, functional/security execution combinations.

Must not include: API logic, assertions, execution code, payload generation, business validation.

### 3.8 Reporter File

May include: Allure reporting, evidence capture, attachments, request/response logs, screenshots when applicable, failure summaries, security/performance findings.

Must not include: API execution, assertions, orchestration, business validation.

### 3.9 Helper File

May include: date utilities, formatting, retry, serialization, environment helpers, safe JSON parsing, generic reusable/conversion utilities.

Must not include: test-specific logic, API-specific logic, business validation, assertions, Playwright test blocks.

### 3.10 Strict Enforcement Contract

For every functional or security script creation, update, refactor, debug, and review operation, the responsible agent MUST:

1. Read this section and `coding-standards.md` sections 2.0 and 2.0-B fresh before changing or accepting artifacts.
2. Classify every created or modified artifact by file type and verify it against the corresponding include/exclude rules in sections 3.1-3.9.
3. Keep functional and security specs separate and apply the security-specific rules in `coding-standards.md` section 2.0-B in addition to this model.
4. Treat any misplaced responsibility as a `CRITICAL` enterprise-layering violation.
5. Correct every enterprise-layering violation before returning generated code or issuing a passing review verdict.

Compliance is fail-closed: generation is incomplete and review status is not `PASSED` while any enterprise-layering violation remains. Examples and existing non-compliant code never override this contract.

---

## 4. Functional Coverage Standard

Evaluate the endpoint and generate only applicable scenarios. Categories:

1. Functional CRUD Validation
2. Authentication Validation
3. Authorization RBAC Validation
4. Business Rule Validation
5. Input Validation
6. Duplicate and Conflict Validation
7. API Contract Validation
8. Data Integrity Validation
9. Performance Validation

### 4.1 Functional CRUD Validation

**POST:** valid request; required fields present; successful creation; response body/headers validation; created resource verification; duplicate creation; invalid creation; cleanup after creation.

**GET:** existing/non-existing record; filter/search/sorting/pagination validation; data consistency; empty result behavior when contract defines it.

**PUT / PATCH:** valid update; partial (PATCH) / full (PUT); invalid update; restricted field update; state transition; persistence; cleanup or rollback.

**DELETE:** valid delete; delete non-existing; soft/hard delete; deleted resource is no longer retrievable; repeated delete behavior when contract defines it.

### 4.2 Authentication Validation

Applies to every secured endpoint.

- Positive: valid token.
- Negative: missing, empty, expired, invalid, malformed, tampered token.
- Expected enterprise standard: `401 Unauthorized`.

Authentication boundary tests may appear in both functional and security coverage, but security coverage remains in dedicated security spec files.

### 4.3 Authorization RBAC Validation

Evaluate RBAC for every endpoint. Supported roles: SA, EA, EU, XR, XT.

- Positive: authorized role can perform allowed action.
- Negative: unauthorized role cannot perform restricted action.
- Expected denial: `403 Forbidden` (`401 Unauthorized` only when authentication is invalid/missing).
- Default XT denial: `401 Unauthorized` unless the contract explicitly overrides.

Required matrix-driven pattern:

```ts
for (const { userRole, expectedStatusCode } of testMatrix.tests.<scenario>) {
  test(`${userRole} can <business action>`, async ({ <fixture> }) => {
    // ...
  });
}

```

---

## 4.4 Business Rule Validation

Generate only when documented in Swagger, requirements, existing tests, source, or user-provided details.

Examples:

- Cannot update closed period.
- Cannot delete active REIT.
- Property must belong to selected REIT.
- Account must belong to selected Client.
- Report period must be open.
- Date ranges must not overlap.
- Effective date must be a future date.
- Field accepts only internal EY domains.
- Field accepts only external non-EY domains.

---

## 4.5 Input Validation Standard

Base validations on the endpoint's request fields and generate only those applicable to the field type and API method.

Use `QESharedTestData` constants whenever available.

### Validation Types

- **Required field**
  - null
  - empty
  - missing
  - undefined

- **Optional field**
  - omitted
  - null
  - empty
  - value provided

- **Text** (`QESharedTestData/test-data/text-validation-constants.ts`)
  - valid text
  - unicode
  - allowed special characters
  - null
  - blank
  - whitespace-only
  - leading/trailing spaces
  - length exceeded
  - invalid special characters
  - min/max length
  - allowed characters

  Apply to POST/PUT/PATCH and sometimes GET/DELETE.

- **Email** (`email-validation-constants.ts`)
  - syntax
  - length
  - internal/external domain
  - case sensitivity

- **Phone** (`phone-validation-constants.ts`)
  - 10 digits positive
  - letters
  - symbols
  - too short
  - too long
  - negative
  - numeric-only
  - length
  - formatting

- **Number** (`number-validation-constants.ts`)
  - integer
  - decimal
  - 0
  - positive
  - negative when allowed
  - text
  - special characters
  - overflow
  - min
  - max
  - precision
  - scale

- **Currency** (`currency-validation-constants.ts`)
  - 0
  - positive
  - decimal precision
  - rounding
  - large amount
  - negative when not allowed

- **Percentage** (`percentage-validation-constants.ts`)
  - 0
  - 100
  - 0.01
  - 99.99
  - -1
  - 101
  - text

- **Date** (`date-validation-constants.ts`)
  - mm/dd/yyyy
  - 32/13/2026
  - 2026-99-99
  - format
  - past
  - future
  - leap year
  - date range validation (`start < end`)

- **Boolean** (`boolean-validation-constants.ts`)
  - true/false
  - 1
  - 0
  - yes
  - no
  - abc

- **Boundary**
  - min-1
  - min
  - min+1
  - max-1
  - max
  - max+1

  Applicable for:
  - text
  - number
  - currency
  - percentage
  - date

- **Null / Blank / Whitespace**
  - `null`
  - `""`
  - `" "`
  - `"\n"`
  - `"\t"`
  - `"\r"`

  Validate separately.

- **Data Type**
  - invalid type combinations
  - string vs. number
  - etc.

---

## 4.6 Duplicate and Conflict Validation

Applies when unique constraints exist.

Validate:

- duplicate create
- duplicate update
- conflict state
- already exists

Expected:

- `409 Conflict`

Do not generate unless the contract or business rule defines uniqueness.

---

## 4.7 API Contract Validation

Mandatory for all successful responses.

Use Zod schemas.

Do not validate business fields before schema validation.

### Successful response validation order

1. Status
2. Body presence
3. Schema
4. Business rules
5. Data integrity
6. Persistence or state verification
7. SLA when applicable

---

## 4.8 Data Integrity Validation

Generate when the endpoint returns:

- collections
- relationships
- mappings
- hierarchies
- IDs
- derived state

Validate:

- no duplicate IDs
- consistent relationships
- valid parent-child mapping
- stable reference data
- stable catalog ID → name mappings
- non-conflicting client assignments
- stable normalized state on repeated GET
- cross-record consistency
- returned data belongs to expected user/client/tenant/context

---

## 4.9 Performance Validation

Generate only when SLA is defined by:

- contract
- framework standard
- user input

Validate:

- response time
- SLA threshold
- stable repeated reads
- no unexpected degradation for repeated calls

Use framework performance utilities.

Do not hardcode SLA values if constants exist.

---

## 4.10 Coverage Priority Standard

When multiple scenario families are applicable, prioritize generation and review in this order:

1. Business Critical
2. Security Critical
3. Contract Critical
4. Data Integrity
5. Negative Validation
6. Edge Cases

Coverage remains fail-closed for mandatory scenarios.

Lower-priority scenarios may be deferred only when explicitly out of scope or blocked by missing required inputs.

---

# 5. Clean-Run-Clean Pattern

All tests follow:

**Precondition → Execute → Validate → Cleanup**

Rules:

- Use `try/finally` whenever test data is created.
- Every test must be independently executable.
- Every test must clean its own data.
- Every rejected request must verify non-mutation when applicable.

---

## 5.1 Pre-condition and Step Execution Contract (Mandatory)

Every generated functional and security test must show clear setup intent and execute actions in strict step order.

### Rules

1. Each `test(...)` must include a pre-condition stage before the API action under test.
2. Pre-condition must state what was prepared (role, auth state, required entity IDs, payload mode) and why.
3. Use `test.step()` for all business actions in this sequence:
   - Pre-condition
   - Action
   - Validation
   - Cleanup
4. If cleanup is required, use `try/finally` and place cleanup logic in the final stage.
5. Never merge pre-condition and validation into a single step.

### Recommended step labels

- Step 1: Pre-condition
- Step 2: Action
- Step 3: Validation
- Step 4: Cleanup

---

# 6. Matrix-Driven Execution

Load matrix at suite level:

```ts
const testMatrix =
  MatrixLoader.loadMatrixFile<TestMatrix>(
    MATRIX_PATHS.<DOMAIN>.<SCENARIO>
  );
```

Use for:

- RBAC roles
- Expected status codes
- Positive/negative role scenarios
- Scenario data
- Method-specific combinations

---

# 7. Required Imports for Functional Specs

Preferred set:

```ts
import { CommonAssertions } from "@assertions/common-assertions";
import { expect, test } from "@base/base-test";
import { TEST_SUITES } from "@constants/app/test-suites-constants";
import { ALLURE_REPORT } from "@constants/framework/allure-constants";
import { TestTags } from "@framework/enums/test-tags-enum";
import { UserRoles } from "@framework/enums/user-roles-enum";
import { HttpStatus } from "@framework/http/http-status-enum";
import type { TestMatrix } from "@framework/models/test-matrix-types";
import { MatrixLoader } from "@test-matrices/matrix-loader";
import { MATRIX_PATHS } from "@test-matrices/matrix-paths";
import { label } from "allure-js-commons";
```

Add domain schemas, models, payload builders, or assertion classes only when used.

Remove unused imports.

---

# 8. Allure Metadata Standard

Every spec must define Allure hierarchy.

For a functional/security spec pair:

- Epic and Feature must be identical.
- The security Story must reuse the functional Story verbatim and append exactly:
  - `- Security Compliance Tests (SASP)`

## Functional

```ts
test.beforeEach(async () => {
  label(ALLURE_REPORT.EPIC, "<API Type>");
  label(ALLURE_REPORT.FEATURE, "<Module>");
  label(ALLURE_REPORT.STORY, "<Business Capability>");
});
```

## Security

```ts
test.beforeEach(async () => {
  label(ALLURE_REPORT.EPIC, "<API Type>");
  label(ALLURE_REPORT.FEATURE, "<Module>");
  label(
    ALLURE_REPORT.STORY,
    "<Business Capability> - Security Compliance Tests (SASP)"
  );
});
```

---

# 9. Tagging Policy

- **Functional tags:**
  - `TestTags.SMOKE`
  - `TestTags.REGRESSION`
  - `TestTags.AUTH_API`
  - `TestTags.CLIENT_API`
  - `TestTags.REIT_API`

- **Security tests:**
  - Only:
    ```ts
    { tag: [TestTags.SECURITY] }
    ```
  - Do not mix with SMOKE/REGRESSION unless the framework explicitly requires it.

---

# 10. Test Comment Standards

## 10.1 Functional Test Comment

```ts
// ======================================================================
// Test Case  ̤: <ID>
// Scenario   : <Business Scenario>
// Requirement: <Requirement ID>
// Role       : <User Role or Matrix-driven role>
// API        : <HTTP Method> <Endpoint>
// Objective  : <Business Objective>
// Expected   : <Expected Result>
// ======================================================================
```

## 10.2 Security Test Comment

```ts
// ======================================================================
// Security Test Case  : <ID>
// SASP ID             : <SASP - ID>
// Category            : <Security Category>
// Role                : <User Role>
// API                 : <HTTP Method> <Endpoint>
// Attack              : <Attack Type>
// Objective           : <Security Objective>
// Expected            : <Expected Secure Behavior>
// ======================================================================
```
---

# 11. Security Testing Standard

Security coverage is generated separately from functional.

Security specs read like a penetration test plan. A reviewer must understand:

- the attack
- the SASP category
- the role/context
- the expected secure behavior

Use `QESharedTestData` payloads; do not hardcode attack payloads or duplicate functional tests in security specs.

---

## 11.1 Supported SASP Categories

1. SASP-01 SQL Injection
2. SASP-02 Oversized Input
3. SASP-03 XSS or HTML Injection
4. SASP-04 LDAP, XPath, or NoSQL Injection
5. SASP-05 Security Headers Validation
6. SASP-06 CRLF Injection
7. SASP-07 Command Injection
8. SASP-08 Authentication Failures
9. SASP-09 RFI or LFI
10. SASP-10 SSRF
11. SASP-12 Deserialization or Prototype Pollution
12. SASP-13 XXE
13. SASP-14 Host Header Poisoning
14. SASP-15 CORS Misconfiguration
15. SASP-16 HTTP Method Tampering
16. SASP-17 Mass Assignment or Parameter Pollution
17. SASP-18 JSON Bomb or Resource Exhaustion
18. SASP-19 Content-Type Confusion
19. SASP-21 Error Message or Sensitive Data Leakage
20. SASP-22 CSRF-style Cross-Origin Evidence
21. SASP-23 Cross-user or Identifier Tampering

If a SASP control does not apply, mark it **Not Applicable** in test case docs or coverage summary.

---

## 11.2 SASP Applicability by Method

### GET

Applicable SASP categories:

- SASP-01
- SASP-03
- SASP-04
- SASP-05
- SASP-06
- SASP-07
- SASP-08
- SASP-09
- SASP-10
- SASP-13 (if Json/Query accepted)
- SASP-14
- SASP-15
- SASP-16
- SASP-19 (if headers processed)
- SASP-21
- SASP-22
- SASP-23

### POST / PUT / PATCH

- All supported SASP categories.

### DELETE Priority List

Applicable:

- SASP-01
- SASP-03
- SASP-04
- SASP-05
- SASP-06
- SASP-07
- SASP-08
- SASP-09
- SASP-10
- SASP-14
- SASP-15
- SASP-16
- SASP-19
- SASP-21
- SASP-22
- SASP-23

Additionally:

- Add SASP-17, SASP-18, SASP-12 if body accepted.
- Add SASP-13 if Json accepted.
- Add SASP-02 if path/query/body size accepted.

---

## 11.3 Security Layer Responsibilities

### Security Spec

Defines **WHAT** security behaviour is being tested.

May include:

- SASP scenarios
- titles
- execution flow
- payload selection
- actor/role selection
- security assertion calls
- header assertion calls
- baseline comparison orchestration
- response verification calls
- business-data exposure verification calls
- Allure metadata
- tags
- `test.describe()` / `test.step()`
- calls to services/assertions/payload builders/token builders
- matrix-driven execution

Must **not** include:

- URL construction
- header creation
- auth token generation
- JWT mutation
- request construction/execution
- response parsing/normalization
- security failure classification
- severity
- Jira title generation
- report formatting
- business-data detection implementation
- payload reflection implementation
- generic helper implementations
- hardcoded attack payloads
- reusable extraction utilities

---

### Security Service

Defines **HOW** the API is attacked.

May include:

- endpoint paths
- URL construction
- HTTP methods
- query/path parameters
- request execution
- header setup
- auth injection
- missing/invalid token scenarios
- raw HTTP execution
- host-header variants
- CORS preflight requests
- security-context methods
- correlation-id extraction
- response extraction
- safe raw response return
- `ApiHelper` integration
- response wrappers
- error translation

Must **not** include:

- assertions
- SASP scenario definitions
- matrices
- tags
- Allure metadata
- severity
- defect classification
- Jira formatting
- payload factories
- business-rule validation
- risk scoring

**Rule:** Service determines what happened; assertions determine whether it is secure.

---

### Security Assertions

Determines whether a response is secure or insecure.

May include:

- approved security status validation
- probe status validation
- unsafe-200 detection
- RBAC denial validation
- authentication/authorization failure validation
- business-data exposure verification
- payload reflection validation
- sensitive/error leakage checks
- header validation
  - required headers
  - forbidden headers
  - CRLF
  - host reflection
  - CORS
- centralized SASP policy validation
- assertion context definitions
- calls to report builders when required

Must **not** include:

- API calls
- request execution
- test blocks
- Allure metadata
- tags
- payload/token creation
- matrix loading
- Jira formatting
- report layout

`SecurityAssertions` may classify unsafe; it should not decide final report layout.

---

### Security Failure Report Builder

Defines HOW the failure is presented.

May include:

- classification
- severity mapping
- formatting
- enterprise diagnosis
- expected/actual behaviour text
- recommended action
- suggested Jira title
- payload/response formatting
- status presentation
- risk explanation
- defect categorisation

Must **not** include:

- assertions
- API calls
- test execution
- request handling
- header validation
- token handling
- service calls
- test data selection

---

### Security Policy

Single source of truth for approved security behaviour.

Examples:

- statuses
- deny responses
- auth policy
- SASP handling
- safe-default rules
- explicit 200 OK policy
- governance comments

Must **not** include:

- assertions
- test data
- API calls
- failure reporting
- Jira generation

---

### Token Builder

Defines WHICH token variant to use:

- invalid
- expired
- malformed
- tampered JWT
- missing claims
- invalid signature
- security mutation

Must **not** include:

- assertions
- API execution
- reporting
- test logic
- endpoint logic

---

### Security Test Data

Defines WHICH attack payloads to execute.

Examples:

- SQLi
- XSS
- CRLF
- command injection
- SSRF
- directory traversal
- LDAP/NoSQL injection
- JSON bomb
- host header
- CORS origins
- unsupported methods
- content-type confusion
- RBAC roles

Must **not** include:

- API calls
- assertions
- services
- execution

---

### Security Helper

Defines HOW reusable security data is transformed.

Examples:

- payload value/label extraction
- response normalization
- safe JSON parsing
- serialization
- baseline comparison
- generic conversions

Must **not** include:

- API calls
- scenarios
- assertions
- reporting
- endpoint logic

### Rule

> If it validates security → Assertions  
> If it transforms data → Helper

---

# 12. Status Code Authority

Precedence for expected status codes:

1. Enterprise QA Standard
2. Business Rules Registry
3. Status Code Policy Registry
4. Swagger / OpenAPI Contract
5. Runtime Evidence

Never change expected status only because runtime behaviour is incorrect.

Runtime conflict with higher-priority authority means expected status remains unchanged and the runtime mismatch is classified as a defect candidate for review.

### Registry References

- Business rules registry:
  ```
  .github/knowledge/registries/business-rules-registry.json
  ```

- Status code policy registry:
  ```
  .github/knowledge/registries/status-code-policy-registry.json
  ```

### Resolution Rule

1. Use enterprise QA standard defaults first.
2. Apply endpoint/business overrides from business rules registry.
3. Apply method/status mappings and tie-breaker rules from status code policy registry.
4. Use Swagger/OpenAPI only where higher layers are silent.
5. Use runtime evidence for defect classification only, never as expected-status authority.

---

## 12.1 Standard Expected Statuses

- Successful POST create: `201 Created`
- Successful POST action: `200 OK` or `202 Accepted` per contract
- Successful GET: `200 OK`
- Successful PUT/PATCH: `200 OK` or `204 No Content` per contract
- Successful DELETE: `204 No Content` or `200 OK` per contract
- Missing/invalid token: `401 Unauthorized`
- Authenticated but unauthorized role: `403 Forbidden`
- Validation failure: `400 Bad Request`
- Not found: `404 Not Found`
- Duplicate/conflict: `409 Conflict`
- Unsupported media type: `415 Unsupported Media Type`
- Unsupported method: `405 Method Not Allowed`
- Safe infrastructure block: `403`, `421`, or framework-approved deny status per security policy

# 13. Functional Spec Generation Rules

1. Analyze method, contract, RBAC, request/response schema, business rules.
2. Generate only applicable scenarios.
3. Use matrix-driven execution.
4. Use service-layer methods only.
5. Use payload builders only.
6. Use centralized assertions.
7. Validate schema for successful responses.
8. Add Allure metadata.
9. Use `test.step()` for all business actions.
10. Use `try/finally` when data is created.
11. Verify persistence for create/update scenarios.
12. Verify non-mutation for rejected scenarios when applicable.
13. Use descriptive business-focused test names.
14. Do not construct URLs in the spec.
15. Do not use inline payload objects.
16. Do not create unused helper methods inside the spec.
17. Validate content type when raw response is available.
18. Validate SLA when contract or framework standard defines it.

### Output Format

When generating code:

- Production-ready Playwright TypeScript only.
- No explanations.
- No pseudo-code.
- No educational notes.

---

# 14. Security Spec Generation Rules

1. Generate a dedicated security spec.
2. Use only `TestTags.SECURITY`.
3. Use SASP mapping.
4. Use `QESharedTestData` security payloads.
5. Use security service methods.
6. Use `SecurityAssertions`.
7. Use `SecurityPolicy` for allowed statuses.
8. Do not duplicate functional tests.
9. Validate safe rejection.
10. Validate no sensitive leakage.
11. Validate no unsafe payload reflection.
12. Validate no unauthorized business data exposure.
13. Validate headers where applicable.
14. Mark non-applicable SASP controls as **Not Applicable** in documentation or coverage summary.
15. Do not hardcode attack payloads in spec files.
16. Do not classify/report security findings inside the spec.

### Output Format

When generating code:

- Production-ready Playwright TypeScript only.
- No explanations.
- No pseudo-code.
- No educational notes.

---

# 15. Artifact Generation Rules

Generate only required artifacts.

Supported artifacts:

- Functional test cases in Markdown
- Security test cases in Markdown
- Functional specs
- Security specs
- Matrix JSON
- `MATRIX_PATHS` updates
- Payload factory updates
- Service updates
- Schema updates
- Assertion updates
- Security policy updates
- Security assertion updates
- Report builder updates
- Model updates
- Helper updates only when generic reuse is required

Always apply:

> **Reuse existing → Extend existing → Create new only when required**

---

## 15.1 Dependency Management Standard

Before creating any new framework component, the agent must verify whether an existing implementation already covers the requirement.

### Required Pre-Create Checks

- Service
- Payload Builder
- Assertion
- Schema
- Helper

### Rules

1. Search and evaluate existing equivalent implementations first.
2. Extend existing components when behavior is compatible.
3. Create new components only when no reusable option exists.
4. Record the reuse evidence and reason for creation when a new component is introduced.
5. Treat duplicate implementations as a **CRITICAL** violation.

---

## 15.2 Test Data Governance

Use test data sources in this exact priority order:

1. `QESharedTestData`
2. Existing test fixtures
3. Existing builders
4. New test data

### Rules

1. Reuse centralized test data whenever available.
2. Reuse existing fixtures before creating new fixtures.
3. Reuse builders before introducing new constants.
4. Create new test data only when required and document the reason.
5. Avoid duplicate values across test suites.
6. Ensure test data remains deterministic and environment-independent.
7. Never hardcode values when approved shared test data exists.

# 16. Spec Review Mode

When the user asks to review a spec file, act as Principal QE Architect and Playwright API Automation Reviewer.

Score each category from 1-10:

1. Test Design
2. Spec File Responsibilities
3. Playwright Best Practices
4. Variable Naming
5. Assertion Quality
6. Data Management
7. Maintainability
8. Enterprise API Testing Standards
9. Import Review
10. Overall Architecture Review

Evaluate:

- Business-focused test names
- Single behavior per test
- No duplicate coverage
- Positive / negative / RBAC / contract / security separation
- Test independence
- Cleanup or rollback strategy
- Thin-spec compliance
- No URL construction in spec
- No request-building logic in spec
- Proper fixture and `test.step()` usage
- Proper assertions
- No unnecessary `beforeEach` work
- Parallel safety
- Descriptive variable names
- No ambiguous names such as:
  - data
  - response
  - result
  - temp
  - obj
- Schema validation
- Business outcome and state-change validation
- GET-after-POST verification when applicable
- Test-data builder usage
- No hardcoded test data unless intentional
- Import cleanup
- Framework responsibility separation

## Final Review Output Format

```md
Enterprise Score: X/10

Critical Issues:

- <Item 1>
- <Item 2>

Medium Issues:

- <Item 1>
- <Item 2>

Minor Improvements:

- <Item 1>
- <Item 2>

Recommended Refactoring:

- <Item 1>
- <Item 2>

Category Scores:

| Category | Score | Notes |
|----------|-------|--------|
| Test Design | X/10 | <notes> |
| Spec File Responsibilities | X/10 | <notes> |
| Playwright Best Practices | X/10 | <notes> |
| Variable Naming | X/10 | <notes> |
| Assertion Quality | X/10 | <notes> |
| Data Management | X/10 | <notes> |
| Maintainability | X/10 | <notes> |
| Enterprise API Testing Standards | X/10 | <notes> |
| Import Review | X/10 | <notes> |
| Overall Architecture Review | X/10 | <notes> |

Enterprise Verdict:
Ready / Needs Improvement / Not Enterprise Ready
```

---

## 16.1 Enterprise Verdict Rules

### Ready

Score ≥ 9.0

Requirements:

- No critical issues
- Thin-spec pattern followed
- Contract validation present
- Matrix, service, payload, and assertion patterns followed

### Needs Improvement

Score 7.0 - 8.9

Characteristics:

- No blocking architecture failure
- Some missing coverage
- Maintainability issues exist

### Not Enterprise Ready

Score < 7.0

Characteristics:

- Critical architecture violations
- Direct URLs or HTTP logic in spec
- Inline payloads across tests
- Missing contract validation
- No cleanup for created data
- Mixed functional/security responsibilities

---

## 16.2 Risk Classification Standard

Use the following risk levels for review findings and enterprise reporting:

- CRITICAL
- HIGH
- MEDIUM
- LOW
- INFO

### Classification Guidance

1. **CRITICAL**
   - Architecture/layering violations
   - Duplicate framework components
   - Security bypass patterns
   - Defects that invalidate trust in test outcomes

2. **HIGH**
   - Significant coverage gaps in business/security/contract-critical paths
   - Unstable tests
   - Strong defect indicators

3. **MEDIUM**
   - Maintainability issues
   - Weaker assertions
   - Incomplete but non-blocking validation

4. **LOW**
   - Minor quality or readability improvements
   - Low execution risk

5. **INFO**
   - Observational notes
   - Optional optimizations

---

# 17. Code Style Rules

Use:

- TypeScript
- Playwright test
- Existing framework fixtures
- Constants
- Enums
- Payload builders
- Services
- Assertions
- Schema models
- Matrix files
- `QESharedTestData` constants

Avoid:

- Inline payloads
- Hardcoded URLs
- role strings
- status coded when enums exits,
- reusable helper methods inside spec files
- business or security logic inside spec files
- dublicated Assertions
- Weak test names
- vague variables
- Unused Imports


# 18. Test Naming Standard

- Functional positive:
  ```ts
  test('${userRole} can <business action>', ...)
  ```

- Functional negative:
  ```ts
  test('${userRole} cannot <business action>', ...)
  ```

- Authentication negative:
  ```ts
  test('Anonymous user cannot <business action> without token', ...)
  ```

- Security:
  ```ts
  test('<SASP-ID> <category> is safely handled for <business capability>', ...)
  ```

Names must be:

- Business-readable
- Allure-friendly

---

# 19. Assertion Standard

Every assertion must have a meaningful failure message.

Validate where applicable:

- Status
- Response body
- Headers
- Content-Type
- Schema contract
- Required properties
- Business rules
- Persistence
- Non-mutation
- Duplicate handling
- Error response
- Sensitive data absence
- SLA
- Data integrity
- Relationship consistency

Rules:

- Do not rely only on null checks.
- Do not validate business fields before schema validation.

### Successful Response Validation Order

1. Status
2. Body presence
3. Schema
4. Business rules
5. Data integrity
6. Persistence / state verification
7. SLA when applicable

---

# 20. Import Review Rule

Always remove unused imports.

Do not import:

- Payload builders if no payload is created.
- `UserRoles` if matrix supplies role and no fixed role is used.
- `HttpStatus` if no explicit status is referenced.
- Schema if no schema validation is performed.
- `expect` if `CommonAssertions` covers all assertions.
- `CommonAssertions` if only `expect` is used.

Use the minimum clean import set required.

---

# 21. Applicability Rule

Before generating any scenario, ask internally:

1. Does the HTTP method support this behavior?
2. Does the contract define this field?
3. Does the business rule exist?
4. Does the endpoint accept body/query/path/header input?
5. Does the role model apply?
6. Is this functional or security coverage?
7. Is this already covered elsewhere?
8. Is this deterministic?
9. Can the test run independently?
10. Can the test clean up after itself?

If not applicable, do not generate the test.

---

# 22. Endpoint Contract Analysis Phase

Before generating artifacts, resolve endpoint details from:

- Swagger/OpenAPI
- Source code
- Existing framework artifacts
- Matrices
- User-provided requirements

Resolve:

- Domain/module
- Endpoint
- HTTP method
- Operation purpose
- Request schema
- Response schema
- Required fields
- Optional fields
- Enum constraints
- Documented headers
- Status codes
- RBAC
- Business rules
- Dependencies
- Cleanup requirements
- SLA
- Existing service methods
- Payload builders
- Schemas
- Assertions
- Matrices

### Endpoint Classification

- POST → create / action / async
- GET → retrieval / search / filtered query
- PUT/PATCH → full or partial update
- DELETE → soft or hard delete

Apply:

> **Reuse → Extend → Create**

Never generate duplicate framework utilities.

---

# 23. Output Behavior

- Code request:
  - Only production-ready code.
  - No explanations.
  - No markdown explanation unless requested.
  - No pseudo-code.

- Review request:
  - Structured enterprise review with scores and verdict per Section 16.

- Prompt request:
  - Copy-paste-ready enterprise prompt.

- Test case list request:
  - Complete functional and security test cases in enterprise format.

- Improvement suggestions request:
  - Categorized actionable recommendations.

- Artifact generation request:
  - Only required artifacts.
  - No unused artifacts.

---

# 24. Final Quality Gate

Before responding, validate:

- Is it enterprise-standard?
- Is it deterministic?
- Is it matrix-driven where needed?
- Is functional coverage separated from security coverage?
- Is the spec thin?
- Are services responsible for API calls?
- Are payload builders responsible for payloads?
- Are assertions centralized?
- Are schemas used for contract validation?
- Are roles handled through matrices?
- Is cleanup included where data is created?
- Are security tests SASP-mapped?
- Are `QESharedTestData` constants referenced where applicable?
- Are imports clean?
- Are names business-readable?
- Are hardcoded values avoided?
- Is the output directly usable?
- Are only applicable scenarios generated?
- Are security findings handled through security assertion/reporting layers?
- Is expected status based on authority, not runtime accident?

If any item fails, improve the output before returning it.

---

# 25. Non-Negotiable Rules

### Never generate

- Irrelevant tests
- Duplicate tests
- Inline payload objects
- URLs inside spec files
- Token generation logic inside spec files
- Header construction inside spec files
- Hardcoded security attack payloads in spec files
- Reusable helper methods inside spec files
- Business logic hidden inside tests
- Runtime-driven expected status changes
- Mixed functional and security spec files
- Unused imports
- Explanations when the user asks for production code only
- Framework utility duplicates
- Security report formatting inside security assertions unless the current framework explicitly requires it

### Always generate

- Clean enterprise structure
- Meaningful test names
- Allure metadata
- `test.step()` blocks
- Matrix-driven role coverage
- Contract validation for success responses
- Cleanup in `finally` blocks when data is created
- Centralized assertions
- Service-layer usage
- Payload-builder usage
- Security separation
- SASP mapping for security tests
- `QESharedTestData` usage where applicable
- Clean imports
- Deterministic and independently executable tests

---

# 26. Golden Rule (Three Audiences)

A generated or reviewed API automation artifact must be understandable by three audiences:

1. **Business reviewer**
   - Understands what behavior is validated.

2. **QE engineer**
   - Understands how to maintain and extend the test.

3. **Security reviewer**
   - Understands what security behavior is covered and what is intentionally not applicable.

If the artifact does not satisfy all three audiences, improve it before returning it.