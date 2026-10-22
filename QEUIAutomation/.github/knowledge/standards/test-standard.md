---
title: Test Knowledge Base & Generation Standards
version: 2.5.0
lastReviewed: 2026-09-10
owner: REITSuite QE Automation
standard: EY Enterprise QA Automation Standard
status: Active
type: Knowledge
ssotFor: Functional/security coverage, status semantics, POST intent resolution, test-case format
---

# REITSuite API Test – Knowledge Base & Generation Standards

This file contains test case generation rules, test matrix format, SASP security framework, and reference patterns used by the REITSuite API Test Agent for producing test cases and scripts.

For project architecture details, see: `architecture.md`

For coding patterns and implementation standards, see: `coding-standards.md`

For execution commands, see: `08-api-test-executor.md`

---

## ✅ API HTTP Status Code Standards

### Success Responses

- GET → **200 OK** (must return response body)

- POST (Create) → **201 Created**
  - Must include `Location` header

- POST (Action) → **200 OK** or **202 Accepted**

#### PUT / PATCH

- If response body present → **200 OK**
- If NO response body → **204 No Content**

#### DELETE

- Default → **204 No Content** (no body)
- If response body present → **200 OK**

### Validation Rules

- **204 MUST NOT** have response body
- **201 MUST** include Location header
- **200 MUST** contain response data

---

### ✅ Group-1 CRUD Functional Baseline (MANDATORY FOR ALL MODULES)

Apply this baseline to:

- Auth
- Client
- REIT
- Report
- TrialBalance

#### POST

- authorized success
- required-fields negative
- duplicate/conflict when applicable
- minimal-header checks:
  - `content-type` JSON on body responses
  - `location` on `201`

#### GET

- existing record success
- non-existing record behavior
- filter validation when query/path filters exist
  - single filter
  - combined filters
  - invalid filters
  - no-filter scenarios

#### PUT / PATCH

- valid update
- invalid update input
- restricted/forbidden/immutable-field update checks
- PATCH must include partial-update behavior checks

#### DELETE

- successful delete contract
  - `204` no body
  - or `200` with body
- non-existing delete behavior

---

### Error Standards

- **400** → Invalid request format
- **422** → Business validation failure
- **401** → Unauthorized
- **403** → Forbidden
- **404** → Not Found

---

## ✅ Higher-Priority Enterprise API Test Policy (MANDATORY)

For QEAPI automation, this policy overlays all generation behavior:

- Execution model:

  `Analyze → Search Existing Code → Reuse → Extend → Create → Generate Functional Coverage → Generate Security Coverage`

- Functional and security coverage must be generated as separate suites.
- Functional RBAC role coverage for non-public endpoints must include:
  - SA
  - EA
  - EU
  - XR
  - XT
- Authentication failures must be validated separately from RBAC failures (`401` vs `403`).
- QESharedTestData is the primary source for field/security validation data.
- Reuse-first order is mandatory:
  1. Existing QEAPI implementations
  2. QESharedTestData
  3. Extension
  4. New code
- When enterprise expected behavior differs from current app behavior, report both without downgrading enterprise expectation.

---

### Mandatory Functional Validation Order

This 19-point order is the detailed execution checklist for scenario design.

For cross-agent handoffs, coverage scoring, and review gating, normalise these checks to the canonical 13-category taxonomy in Validation Taxonomy Authority.

1. Functional CRUD Validation
2. Authorization and RBAC Validation
3. Business Rule Validation
4. Authentication Validation
5. Required vs Optional Fields Validation
6. Data Type Validation
7. Boundary Validation
8. Null, Blank, and Whitespace Validation
9. Text Field Validation
10. Email Validation
11. Phone Validation
12. Number Validation
13. Currency Validation
14. Percentage Validation
15. Date Validation
16. Boolean Validation
17. Duplicate and Conflict Validation
18. API Contract Validation
19. Security Validation (separate suite)

### Normalization Rules

- Steps 1–19 above are design-time detail.
- Cross-agent contracts (`ANALYSIS_HANDOFF.validationCoverage`) MUST use category IDs 1–13 only.
- Catrgory 13
     - File import and Export Validation is a conditional category and MUST be included when endpoint behavior supports upload,download,import or export flows even though it is not a standalone line in the 19 - step sequence.

---

### Mandatory Endpoint Design Output

Endpoint deliverables must include the 25-section format defined by the Test Design Agent:

- Endpoint summary
- Schema summary
- Required/optional fields
- Validation matrices
- Functional scenarios
- Security scenarios
- RBAC/Auth matrices
- Contract rules
- Payload examples
- Expected status/assertions
- Reuse plan
- Unavoidable new-code declaration

---

## ✅ API Failure Reporting Standard (MANDATORY)

For API-flow validation failures, generated assertion modules must use the standardized:

```javascript
Logger.handleError(...)
```

structure so failures are consistent and diagnosable.

### Required Failure Header and Sections

```text
❌ API TEST FAILURE — ${errorSummary}

📄 General Info
🔍 Status Comparison
💡 Context
📦 Request Payload
📄 Response Body
💥 Root Cause
```

### Required Details for Assertion-Layer Status Mismatches

- `httpMethod`
- `url`
- `expectedStatusCode`
- `actualStatusCode`
- `role`
- `clientId` (if available)
- `payload` (if available)
- `responseBody` (if available)

### Enforcement Rules

- Assertion modules are the response-validation boundary for status, headers, body, business rules, and schema application.
- Specs own test flow and invoke assertion-layer APIs with expected values and the actual typed service result.
- Service methods perform API calls only and must not assert or validate responses.
- Specs should not duplicate reusable status-only assertions inline when an assertion-layer API exists.
- Raw-request token scenarios may assert status directly, but should include descriptive assertion messages.
- For intentional raw-request security probes that bypass service wrappers, use:

```javascript
SecurityAssertions.assertExpectedSecurityStatus(
    actualStatus,
    message,
    expectedStatus,
    context
)
```

so deny-status mismatches still emit standardized:

```text
❌ API TEST FAILURE
```

diagnostics.

- In strict security scenarios, pass explicit `expectedStatus` and include context fields:
  - `httpMethod`
  - `url`
  - `role`
  - `payload`
  - `responseBody`

for complete failure triage output.

---

## ✅ Current vs Enterprise Status Handling (MANDATORY)

Status authority must be interpreted in this strict order:

1. Enterprise expected status is authoritative for generated expectations.
2. Runtime actual status is execution evidence only (used for defect classification, not expectation authoring).

### Rules

- Do not downgrade expected enterprise status to match an observed application defect.
- Keep expectation authoring separate from runtime observation.
- When runtime status conflicts with enterprise expectation:
  - classify as application defect (or candidate)
  - retain enterprise expectation in tests
- Swagger/OpenAPI status codes must not be used to set, override, or compare expected status.
- For POST operations:
  - resolve operation intent first (create/action/async)
  - use the deterministic algorithm below
  - never infer intent by judgement

---

## ✅ POST Intent Resolution (DETERMINISTIC — Evaluate In Order, Stop At First Match)

| Rule | Condition | Intent | Expected Status | Additional Requirement |
|--------|-----------|--------|--------|--------|
| 1 | Business/operation evidence indicates deferred processing (`async`, `queue`, `job`, or explicit completion-later behaviour) | ASYNC | 202 | Assert async acknowledgement contract |
| 2 | `operationId`, path segment, summary, or description matches `/create|add|register|import|upload/` OR semantics indicate new-resource creation | CREATE | 201 | Assert `Location` response header |
| 3 | Rule 2 did not match and either a documented synchronous bulk import processes a mix of creates/updates/deletes OR `operationId`, path segment, summary, or description matches `/search|query|filter|list|validate|calculate|export|approve|reject|submit|recalculate/` | ACTION | 200 | — |
| 4 | None of the above | UNRESOLVED | — | **DO NOT GUESS** |

### Rule 4 Handling

Emit:

```text
ANALYZER_QUESTION_REQUEST
```

to:

```text
03-test-requirements-analyzer
```

with:

```json
{
  "question": "Is POST <path> a resource-creation or an action endpoint?",
  "options": [
    "Creation (201)",
    "Action (200)",
    "Async (202)"
  ]
}
```

The applied rule number MUST be recorded in:

```text
ANALYSIS_HANDOFF.statusResolution.ruleApplied
```

for traceability.

A POST expectation without a recorded `ruleApplied` is a **CRITICAL review finding**.

---

# TEST CASES GENERATION RULES

## ✅ Validation Taxonomy Authority (Mandatory)

Analyzer, Designer, Reviewer, and this standard use a single normalized validation taxonomy of **13 categories**.

### Authoritative Rule

- `ANALYSIS_HANDOFF.validationCoverage` must contain category IDs **1-13** only.
- Reviewer completeness checks must evaluate categories 1-13 only.
- Do not use or reintroduce any legacy 16-category model for cross-agent gating.

### Normalized Categories (1-13)

1. Business Validation
2. Authentication Validation
3. Authorization and RBAC Validation
4. Input Validation
5. Field-Type Validation
6. Required vs Optional Validation
7. Boundary Validation
8. Duplicate and Conflict
9. CRUD Functional Validation
10. Response COntract Validation
11. Header and Content-Type Validation
13. API Security Validation
14. File Import and Export Validation

### Mapping: 19-Step Checklist → 13 Canonical Categories

| Detailed Step (Mandatory Functional Validation Order) | Canonical Category ID | Canonical Category Name |
|------------------------------------------------------|----------------------|------------------------|
| 1. Functional CRUD Validation | 9 | CRUD Functional Validation |
| 2. Authorization and RBAC Validation | 3 | Authorization and RBAC Validation |
| 3. Business Rule Validation | 1 | Business Validation |
| 4. Authentication Validation | 2 | Authentication Validation |
| 5. Required vs Optional Fields Validation | 6 | Required vs Optional Validation |
| 6. Data Type Validation | 5 | Field-Type Validation |
| 7. Boundary Validation | 7 | Boundary Validation |
| 8. Null, Blank, and Whitespace Validation | 4 | Input Validation |
| 9. Text Field Validation | 4 | Input Validation |
| 10. Email Validation | 4 | Input Validation |
| 11. Phone Validation | 4 | Input Validation |
| 12. Number Validation | 5 | Field-Type Validation |
| 13. Currency Validation | 5 | Field-Type Validation |
| 14. Percentage Validation | 5 | Field-Type Validation |
| 15. Date Validation | 5 | Field-Type Validation |
| 16. Boolean Validation | 5 | Field-Type Validation |
| 17. Duplicate and Conflict Validation | 8 | Duplicate and Conflict Validation |
| 18. API Contract Validation | 10 and 11 | Response Contract Validation; Header and Content-Type Validation |
| 19. Security Validation (separate suite) | 12 | API Security Validation |

#### Applicability Rule

Categories are still evidence-driven:

- Required
- Conditional
- Not Applicable

However, numbering and identity remain fixed to **1-13**.

---

### File Naming

```text
test-cases/<domain>-api-test-cases/functional/<feature-folder>/<N>.<domain>-api.<httpmethod>.<action>.<entity>-functional.md

test-cases/<domain>-api-test-cases/security/<feature-folder>/<N>.<domain>-api.<httpmethod>.<action>.<entity>-security.md
```

---

### Folder Placement Rule (MANDATORY)

For generated test-case files, `<feature-folder>` must be the resolved module folder.

#### Resolution Order

1. Selected Swagger module/tag from endpoint picker (authoritative)
2. Manual fallback only when Swagger module is unavailable; derive from endpoint path segment after `/api/`

#### Normalization

Convert resolved module name to kebab-case lowercase for the folder name.

Examples:

```text
MyEy -> my-ey
UserAuditTrail -> user-audit-trail
ExternalUserDataVisibility -> external-user-data-visibility
```

#### Placement Constraints

- Never place files under a different module folder than the resolved module.
- Never place MyEy endpoint test-case files under `authorization` or `authentication`.
- Create:

```text
functional/<module-folder>/
security/<module-folder>/
```

if missing.

- Reuse existing module folders when present; do not create duplicate variants.

#### Where

```text
<N>           = numeric index (e.g. 1, 2, 11)

<domain>      = auth | client | reit | report | trialbalance

<httpmethod>  = lowercase get | post | put | delete

<action>      = verb phrase token
                (e.g. manage, create, update, delete, get)

<entity>      = kebab-case entity token
                (e.g. analytics-entitlement)
```

#### Examples

Functional:

```text
1.auth-api.post.manage.analytics-entitlement-functional.md
```

Security:

```text
1.auth-api.post.manage.analytics-entitlement-security.md
```

---

### User-Facing Test Plan Output Standard (MANDATORY)

Generate user-facing test plans only.

The generated `test-cases.md` document must be written for:

- QA Engineers
- Test Reviewers
- Business Analysts
- Product Owners

#### Do NOT Include Any Internal Implementation Details

Never display:

- Metadata sections
- Story metadata tables
- Matrix references
- Traceability matrices
- Source file names
- Spec file names
- JSON file names
- Internal repository paths
- Tags
- Agent names
- Workflow details
- Swagger processing details
- Knowledge-source references
- Contract lookup information
- Coverage calculations
- Internal reasoning
- Technical analysis notes
- Executive summaries generated from implementation reviews

#### Do NOT Include Sections Such As

```text
## Metadata
## Traceability
## Matrix Mapping
## Internal Analysis
## Repository Referenced
## Related Files
## Source Contracts
## Agent Findings

The document must focus only on the test case itself.

#### Required Output Structure

```markdown
# <Module> — Test Plan

## Module
<Module Name>

## Test Case Title
<Human-readable business scenario>

## Test Case ID
<Deterministic test case ID>

## Business Objective
Describe what business behavior is being validated.

## Preconditions
List business and technical prerequisites.

## Request Details
Method, Endpoint, Headers (if needed)

## Payload
Request payload if applicable.

## Test Data
Only relevant test data required to execute the test.

## Detailed Test Steps
Step-by-step execution instructions.

## Expected Results Per Step
Expected outcome for each detailed step.

## Post Conditions
State and data expectations after execution (including cleanup expectations).

## Automation Notes
Automation guidance including reusable service/assertion hooks,
data setup/cleanup guidance, and determinism notes.

## Final Expected Result
Expected API behavior.
Expected HTTP Status.
Expected response validation.
Expected business outcome.
```

---

### Test Case ID Format

```text
TC_<MODULE>_API_<FEATURE>_<ID>
```

---

### Spec File Naming (Option A)

```text
tests/<domain>-api/<feature-folder>/<NN>.<domain>-api.<httpmethod>.<action>.<entity>.spec.ts

tests/<domain>-api/<feature-folder>/<NN>.<domain>-api.<httpmethod>.<action>.<entity>.security.spec.ts
```

#### Examples

Functional spec:

```text
02.auth-api.post.manage.analytics-entitlement.spec.ts
```

Security spec:

```text
01.auth-api.post.manage.analytics-entitlement.security.spec.ts
```

---

### Functional Script Generation Pattern (MANDATORY)

For role-based functional scenarios, generated Playwright specs MUST use matrix-driven loops:

```typescript
for (const { userRole, expectedStatusCode } of testMatrix.tests.<scenarioKey>) {
  test(`${userRole} can/cannot <action>`, async ({ apiFixture }) => {
    // scenario implementation
  });
}
```

#### Rules

- Apply this pattern to functional specs only (`*.spec.ts`).
- Do not apply this pattern to security specs (`*.security.spec.ts`).
- Keep role/status mappings in matrix JSON so new roles can be added without spec code changes.

---

### Scenario Format

```text
Scenario <N> — <UserRole> can/cannot <Action> (<Positive/Negative>)
```

Each scenario MUST include:

- Test Case ID
- Business Objective
- Preconditions
- Request Details
- Payload (POST/PUT/PATCH only)
- Test Data
- Detailed Test Steps
- Expected Results Per Step
- Post Conditions
- Automation Notes
- Final Expected Result

#### Step Requirements

Summary-only steps are prohibited.

Every step must include:

1. Action (what is executed)
2. Purpose (why this step exists)
3. Expected Outcome (what must be true after the step)

---

### Detailed Test Case Style (MANDATORY)

- Test steps must be explicit and executable.
- Avoid high-level summaries as substitutes for execution instructions.
- Each step should be independently verifiable.
- Expected results must align directly with the corresponding step.
- Use deterministic test data wherever possible.
- Include cleanup guidance when state is modified.
- Business outcomes must be stated separately from technical outcomes.

---

### Automation Guidance Standards

Automation notes should include:

- Reusable service methods
- Assertion-layer APIs
- Required test data setup
- Cleanup operations
- Role mappings
- Matrix references used by automation
- Deterministic execution considerations

Do not embed implementation-specific code outside designated automation sections.

---

### Final Expected Result Requirements

Every test case must explicitly define:

- Expected API behavior
- Expected HTTP status code
- Expected response-body validation
- Expected schema validation
- Expected business-rule validation
- Expected authorization outcome (if applicable)
- Expected persistence/state outcome (if applicable)

The final expected result must clearly distinguish:

- Technical success criteria
- Business success criteria

---

### Functional vs Security Suite Separation

Functional suites:

```text
functional/
```

Focus on:

- CRUD behavior
- Business validation
- Data validation
- API contracts
- User workflows

Security suites:

```text
security/
```

Focus on:

- Authentication
- Authorization
- RBAC
- Privilege escalation
- Input security
- Endpoint protection
- Security boundary validation

Functional and security coverage MUST be generated and maintained separately.

---

### Review Gate Requirements

Generated artifacts are review-ready only when:

- Validation taxonomy uses IDs 1–13 only.
- POST status resolution includes recorded `ruleApplied`.
- Functional and security suites are separated.
- Enterprise status expectations are preserved.
- Naming standards are followed.
- Folder placement rules are followed.
- Test case format follows the user-facing output standard.
- Assertion-layer APIs are used correctly.
- Coverage includes all applicable validation categories.

### Detailed Test Case Style (MANDATORY)

All generated functional and security test cases must follow the same long-form detail style as:

- `test-cases/auth-api-test-cases/functional/authorization/1.auth.api.post.manage.system-administrator-functional.md` (POST reference)
- `test-cases/auth-api-test-cases/functional/authorization/1.auth.api.get.manage.system-administrator-users-functional.md` (GET reference)

#### Required Section Order Per Test Case

1. `# <Module> — Test Plan`
2. `## Module`
3. `## Test Case Title`
4. `## Test Case ID`
5. `## Business Objective`
6. `## Preconditions`
7. `## Request Details`
8. `## Payload`
   - POST / PUT / PATCH: request payload
   - GET / DELETE: explicit `No request body required`
9. `## Test Data`
10. `## Detailed Test Steps`
11. `## Expected Results Per Step`
12. `## Post Conditions`
13. `## Automation Notes`
14. `## Final Expected Result`

---

#### Method-Specific Detail Requirements

##### GET

Include:

- Query parameter details
- Path parameter details
- Response shape validation
- Authorization coverage

##### POST

Include:

- Happy path validation
- Duplicate/conflict validation
- RBAC coverage
- Cleanup expectations

##### PUT

Include:

- Update semantics
- Field-level validation
- Response-body vs no-body expectations

##### DELETE

Include:

- Target identification
- Forbidden scenarios
- Post-delete verification
- Status handling:
  - `204 No Content` (no body)
  - `200 OK` (with body)

---

#### Detailed Step Quality Requirements

- Steps are sequentially numbered.
- Steps must be independently understandable by manual testers.
- Expected results must map step-by-step using matching numbering.
- Include:
  - status validation
  - data validation
  - business validation
  where applicable.
- Post Conditions must explicitly state:
  - cleanup outcome
  - non-mutation expectations for rejected actions
- Automation Notes must identify reusable framework components:
  - service
  - payload
  - assertion
  - fixture

and avoid implementation ambiguity.

---

#### No Assumptions Policy

- Do not generate test cases when required inputs are missing.
- Ask for missing information and block generation until inputs are complete.

---

### Test Coverage Categories (In Order)

1. Functional (CRUD)
   - Happy path by each authorized role

2. RBAC / Authorization
   - Denied access for unauthorized roles

3. Duplicate / Idempotency
   - Conflict on repeat requests

4. Input Validation
   - Missing fields
   - Invalid fields

5. Boundary Value Analysis
   - Minimum values
   - Maximum values
   - Exceeds maximum
   - Empty values
   - Special characters

6. Security
   - Expired token
   - Missing authentication
   - Injection attempts

7. Error Handling
   - Resource not found
   - Invalid references
   - Invalid payloads

8. Schema / Contract Validation
   - Response structure validation

---

Coverage is applicability-driven.

Authoritative order:

1. Acceptance Criteria
2. Confirmed Business Rules
3. HTTP Semantics
4. Request/Response Schema
5. Matching QESharedTestData Metadata

Evaluate all categories, but generate a scenario only when:

- Behavior exists
- Expected outcome is evidenced

Record unsupported categories as:

- `Not Applicable`

Block and ask for clarification when a missing rule would affect expected behaviour or status.

---

### Shared Validation Data Requirement

Before designing field validation:

Inspect:

```text
QESharedTestData/src/index.ts
```

and matching configuration files:

```text
page-fields/*-field-configs-constants.ts
test-data/*-validation-constants.ts
```

Reuse canonical:

```text
@reitsuite-qe/test-data
```

exports where available.

Shared data defines:

- Input partitions
- Validation values

Shared data does NOT define:

- Endpoint acceptance criteria
- Business behaviour
- Expected status codes

---

### Enhanced Scenario Types (POST / PUT)

| # | Scenario Type | Applies To |
|---|---------------|------------|
| 1 | Functional Positive (per authorized role) | All |
| 2 | RBAC Negative (per unauthorized role) | All |
| 3 | Duplicate / Conflict | POST, PUT when uniqueness/idempotency/concurrency behaviour exists |
| 4 | Missing Required Fields | POST, PUT |
| 5 | Field Max Length Exceeded | POST, PUT |
| 6 | Field Min Length Violation | POST, PUT |
| 7 | Non-Printable Characters | POST, PUT |
| 8 | BVA: Single Character | POST, PUT |
| 9 | BVA: Maximum Valid Value | POST, PUT |
| 10 | BVA: Exceeds Maximum | POST, PUT |
| 11 | BVA: Zero Value | POST, PUT |
| 12 | BVA: Special Characters | POST, PUT |
| 13 | Positive Email Validation | Email fields using representative shared-data partitions |
| 14 | Negative Email Validation | Email fields using representative shared-data partitions |
| 15 | External Domain Restriction | Email fields restricted to internal domains |
| 16 | Phone Validation | Phone fields using representative shared-data partitions |
| 17 | Special Characters (Positive) | Text fields |
| 18 | SQL Injection Validation | POST, PUT |
| 19 | XSS Injection Validation | POST, PUT |
| 20 | HTML Injection Validation | POST, PUT |
| 21 | Script Injection Validation | POST, PUT |
| 22 | Expired Token Validation | All roles |
| 23 | Self-Deletion Validation | If applicable |
| 24 | Unauthorized Delete Validation | If applicable |
| 25 | File Export Validation | File endpoints |
| 26 | File Import Validation | File endpoints |
| 27 | Import Data Validation | File endpoints |

---

### Coverage Enforcement

All applicable scenario types must be evaluated.

Scenario omission is allowed only when:

- Not applicable to endpoint behaviour
- Not applicable to field type
- Not applicable to security model
- Not applicable to business rules

Such omissions must be recorded as:

```text
Not Applicable
```

with justification.

---

### Enterprise Generation Priority

Coverage priority order:

1. Functional Behaviour
2. Authorization / RBAC
3. Input Validation
4. Boundary Validation
5. Contract Validation
6. Security Validation
7. Error Handling
8. File Processing Scenarios

Functional and security coverage remain separate deliverables at all times.

### Enhanced Scenario Types (POST/PUT)

| # | Type | Applies To |
|---|------|------------|
| 1 | Functional Positive (per authorized role) | All |
| 2 | RBAC Negative (per unauthorized role) | All |
| 3 | Duplicate / Conflict | POST, PUT only when uniqueness, idempotency, or concurrency behavior is evidenced |
| 4 | Missing Required Fields | POST, PUT |
| 5 | Field Max Length Exceeded | POST, PUT |
| 6 | Field Min Length Violation | POST, PUT |
| 7 | Non-Printable Characters | POST, PUT |
| 8-12 | BVA (Single Char, Max Valid, Exceeds Max, Zero, Special Chars) | POST, PUT |
| 13 | Positive Email Validation | Email fields; representative shared-data partitions |
| 14 | Negative Email Validation | Email fields; representative shared-data partitions selected by risk |
| 15 | External Domain Restriction | Email fields explicitly restricted to internal domains |
| 16 | Phone Validation | Phone fields; representative shared-data partitions selected by risk |
| 17 | Special Characters (Positive) | Text fields |
| 18-21 | SQL/XSS/HTML Injection in Text & Email Fields | POST, PUT |
| 22 | Expired Token (All Roles) | All |
| 23-24 | Self-Deletion / Unauthorized Delete | If applicable |
| 25-27 | File Export / Import / Import Validation | File endpoints |
| 28-33 | DELETE Scenarios (existing, non-existent, already-deleted, dependencies, soft-delete, cascade) | DELETE |
| 34-41 | Pagination & Sorting | GET list endpoints |
| 42-43 | PATCH Partial Payload / Null Handling | PATCH |
| 44-45 | Concurrent Duplicate / Update Conflict | POST, PUT |

---

# TEST MATRIX FORMAT

### File Location

```text
src/test-matrices/<domain>-test-matrices/<matrix-name>.json
```

### Structure

```json
{
  "//": "Description: <What this matrix covers>",
  "tests": {
    "createEntityPositive": [
      {
        "userRole": "System Administrator",
        "expectedStatusCode": 201
      },
      {
        "userRole": "Engagement Administrator",
        "expectedStatusCode": 201
      }
    ],

    "createEntityUnauthorized": [
      {
        "userRole": "Engagement User",
        "expectedStatusCode": 403
      },
      {
        "userRole": "External Checklist User",
        "expectedStatusCode": 403
      }
    ]
  }
}
```

---

### Key Naming Convention

| Scenario | Pattern |
|-----------|----------|
| Positive | `<action><Entity>` |
| Unauthorized | `<action><Entity>Unauthorized` |
| Duplicate | `<action>Duplicate<Entity>` |
| Missing Field | `missing<Field><Entity>` |
| BVA | `<action><Entity>MinLength` / `MaxLength` / `MaxLengthExceeded` |
| Expired Token | `<action><Entity>ExpiredToken` |

---

### Status Codes

| Scenario | Code |
|-----------|------|
| Create Success | 201 |
| Read Success | 200 |
| Update Success (response body present) | 200 |
| Update Success (no response body) | 204 |
| Delete Success (no response body) | 204 |
| Delete Success (response body present) | 200 |
| RBAC Denied | 403 |
| External Temp User (XT), including role/access denial | 401 |
| Validation Error | 400 |
| Duplicate / Conflict | 409 |
| Not Found | 404 |
| Unauthorized (Expired Token) | 401 |

---

# SASP SECURITY FRAMEWORK

## Section 3: Core Tests (SASP-01 to SASP-14)

| SASP ID | Category | Payload Constant | Applies To |
|----------|----------|------------------|------------|
| SASP-01 | SQL Injection | `SQL_INJECTION_PAYLOADS` | All |
| SASP-02 | Buffer Overflow | `BUFFER_OVERFLOW_PAYLOADS` | POST/PUT |
| SASP-03 | XSS / HTML Injection | `generateInputByType(InputDataType.XSSPayload)` / `HTMLTags` | All |
| SASP-04 | LDAP / XPath / NoSQL Injection | `LDAP_INJECTION_PAYLOADS`, `XPATH_INJECTION_PAYLOADS`, `NOSQL_INJECTION_PAYLOADS` | POST/PUT |
| SASP-05 | Security Response Headers | `REQUIRED_SECURITY_HEADERS`, `FORBIDDEN_RESPONSE_HEADERS` | All |
| SASP-06 | CRLF Header Injection | `CRLF_INJECTION_PAYLOADS` | All |
| SASP-07 | Command Injection | `COMMAND_INJECTION_PAYLOADS` | All |
| SASP-08 | Directory Traversal | `DIRECTORY_TRAVERSAL_PAYLOADS` | All |
| SASP-09 | RFI / LFI | `RFI_LFI_PAYLOADS` | All |
| SASP-10 | SSRF | `SSRF_PAYLOADS` | POST/PUT |
| SASP-11 | IDOR | N/A (cross-role access test) | All |
| SASP-12 | Insecure Deserialization | `DESERIALIZATION_PAYLOADS` | POST/PUT |
| SASP-13 | XXE Injection | `XXE_PAYLOADS` | POST/PUT |
| SASP-14 | Host Header Poisoning | `HOST_HEADER_PAYLOADS` | All |

---

## Section 4: Extended Tests (SASP-15 to SASP-23) — POST/PUT Only

| SASP ID | Category | Payload Constant |
|----------|----------|------------------|
| SASP-15 | CORS Misconfiguration | `CORS_TEST_ORIGINS` |
| SASP-16 | HTTP Method Tampering | `UNSUPPORTED_HTTP_METHODS` |
| SASP-17 | Mass Assignment | `MASS_ASSIGNMENT_PAYLOADS` |
| SASP-18 | Resource Exhaustion | `JSON_BOMB_PAYLOADS` |
| SASP-19 | Content-Type Confusion | `CONTENT_TYPE_CONFUSION` |
| SASP-20 | Token Security | `buildMalformedJwtToken`, `buildTamperedJwtToken`, `expireRealToken`, `sendRequestWithoutToken` |
| SASP-21 | Error Message Leakage | `ERROR_LEAKAGE_PATTERNS`, `SENSITIVE_RESPONSE_PATTERNS` |
| SASP-22 | CSRF Protection | `CSRF_TEST_HEADERS` |
| SASP-23 | Horizontal BOLA | N/A (cross-user access test) |

---

## Coverage Tiers

| Endpoint Type | SASP Coverage | Tests |
|---------------|---------------|-------|
| POST / PUT | Full applicable SASP-01 to SASP-23 | One test per applicable attack category |
| GET | Subset SASP-01, 03, 05, 06, 07, 08, 09, 14, 17 | 9-10 tests |

---

### Security Spec Imports (POST/PUT)

```typescript
import { TokenService } from '@auth/token-service';
import { HttpStatus } from '@framework/http/http-status-enum';
import { ContentType } from '@framework/http/http-header-constants';
import { HttpMethod } from '@framework/http/http-method-enum';

import { ApiHelper } from '@helpers/api/api-helper';

import {
  buildExpiredTokenFromJwt as expireRealToken
} from '@helpers/api/token-builders/expired-token-builder';

import {
  buildMalformedJwtToken
} from '@helpers/api/token-builders/malformed-token-builder';

import {
  sendRequestWithoutToken
} from '@helpers/api/token-builders/negative-auth-api-helper';

import {
  buildTamperedJwtToken
} from '@helpers/api/token-builders/tampered-token-builder';

import {
  BUFFER_OVERFLOW_PAYLOADS,
  COMMAND_INJECTION_PAYLOADS,
  CONTENT_TYPE_CONFUSION,
  CORS_TEST_ORIGINS,
  CRLF_INJECTION_PAYLOADS,
  CSRF_TEST_HEADERS,
  DESERIALIZATION_PAYLOADS,
  DIRECTORY_TRAVERSAL_PAYLOADS,
  ERROR_LEAKAGE_PATTERNS,
  FORBIDDEN_RESPONSE_HEADERS,
  generateInputByType,
  HOST_HEADER_PAYLOADS,
  InputDataType,
  JSON_BOMB_PAYLOADS,
  LDAP_INJECTION_PAYLOADS,
  MASS_ASSIGNMENT_PAYLOADS,
  NOSQL_INJECTION_PAYLOADS,
  REQUIRED_SECURITY_HEADERS,
  RFI_LFI_PAYLOADS,
  SENSITIVE_RESPONSE_PATTERNS,
  SQL_INJECTION_PAYLOADS,
  SSRF_PAYLOADS,
  UNSUPPORTED_HTTP_METHODS,
  XPATH_INJECTION_PAYLOADS,
  XXE_PAYLOADS
} from '@reitsuite-qe/test-data';
```

---

### Security Spec Structure

```typescript
test.describe(TEST_SUITES.<DOMAIN>, () => {

  test.beforeEach(async () => {
    /* Allure labels */
  });

  // SECTION 3: SASP-01 to SASP-14

  test(
    'SASP-01: SA cannot manage analytics entitlements with SQL injection',
    { tag: [TestTags.SECURITY] },
    async ({ request }) => {

      for (const [index, payload] of SQL_INJECTION_PAYLOADS.entries()) {

        await test.step(
          `Submit SQL injection payload ${index + 1}`,
          async () => {
            // test body
          }
        );
      }
    }
  );

  // SECTION 4: SASP-15 to SASP-23 (POST/PUT only)

});
```

---

### Security Test Rules

1. Tag:

```typescript
{ tag: [TestTags.SECURITY] }
```

2. Register exactly one Playwright `test()` per applicable attack category.

   Default mode:

   - run representative payload samples as `test.step()` calls
   - optimized for regression execution

   Deep mode:

   - run full payload sweeps
   - only for high-risk endpoints or explicitly requested deep-security execution

3. Baseline assertion:

```typescript
not.toBe(HttpStatus.INTERNAL_SERVER_ERROR)
```

4. Payload source:

```text
ALWAYS from @reitsuite-qe/test-data
```

Never inline payload lists.

5. Title pattern:

```text
<Role> cannot <attack> through <business capability>
```

Example:

```text
System Administrator cannot inject SQL through Property Name during Property Master creation
```

If SASP appears in title:

```text
SASP-01: <Role> cannot <attack> through <business capability>
```

6. Do not generate rate-limit security scripts.

Excluded:

```text
SASP-24
RATE_LIMIT_CONFIG
```

7. Security specs are System Administrator focused.

Do NOT generate role-matrix denied-user loops:

```text
EA
EU
XR
XT
```

inside `*.security.spec.ts`.

RBAC denied-role coverage belongs inside functional suites.

---

### Security Assertion Rule (MANDATORY)

All `*.security.spec.ts` files MUST use:

```typescript
SecurityAssertions
```

from:

```typescript
src/assertions/security-assertions.ts
```

for:

- status validation
- header validation
- probe validation
- leakage validation

Security specs MUST NOT contain:

- inline `expect(status).toBe(...)`
- inline allowed-status arrays
- inline security-header loops
- inline leakage-pattern loops
- inline regex checks
- duplicated security-probe handlers

Use:

```typescript
assertExpectedSecurityStatus()
assertSecurityProbeStatus()
assertSecurityProbeSafe()
assertRequiredResponseHeaders()
assertNoLeakedHeaders()
assertNoInjectedResponseHeader()
```

All SASP attack-probe tests MUST call:

```typescript
assertSecurityProbeSafe()
```

and pass:

```typescript
SecurityAssertionContext
```

containing:

```typescript
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

Specs MUST NOT:

- build custom failure messages
- generate Jira-style summaries

Failure formatting is centralized in:

```text
security-assertions.ts
```

Reference:

```text
coding-standards.md
§2.12.1
```

---

### Security Test Case Detail Standard (MANDATORY)

Do not generate summary-style security test cases.

Every security test case must be execution-ready for:

- Manual QA
- Automation
- Security Review
- Business Review

#### Required Fields

1. Security Test Case ID
2. Title
3. SASP ID
4. Security Category
5. Severity (`Critical`, `High`, `Medium`, `Low`)
6. Security Objective
7. Attack Surface
   - explicit fields
   - parameters
   - headers
8. Attack Payload
   - explicit payload values
   - or named payload catalog entries
9. Preconditions
10. Detailed Attack Steps
11. Expected Results Per Step
12. Risk If Failed
13. Post Conditions
14. Automation Notes

---

#### Detailed Attack Step Rule

Every step must include:

- Action
- Purpose
- Expected Outcome

Expected results must define:

- pass/fail criteria
- status behaviour
- leakage checks
- mutation checks
- security assertion expectations

Invalid example:

```text
Handled safely
```

without payload, field, or verification detail.

---

#### Security Risk Rule

`Risk If Failed` must explain security impact in business terms.

Examples:

- Data exposure
- Privilege escalation
- Integrity loss
- Service disruption

---

# REFERENCE TEST CASES

| Domain | Reference | Key Patterns |
|----------|----------|----------|
| Auth (POST Create) | `test-cases/auth-api-test-cases/functional/authorization/1.auth.api.post.manage.system-administrator-functional.md` | Multi-domain email, 13+ scenarios, emoji headers |
| Auth (PUT Role Change) | `test-cases/auth-api-test-cases/functional/authorization/5.auth.api.put.manage.role-change-functional.md` | Role change preconditions, verification steps |
| Client (POST Create) | `test-cases/client-api-test-cases/functional/clients/1.client.api.post.manage.client-functional.md` | 19-scenario depth, phone validation, XSS/SQL coverage |

---

For:

- Zod response-shape patterns → see `coding-standards.md` Section 2.22
- Cross-agent policy synchronization → see:
  - `.github/config/consistency-policy.md`
  - `.github/config/enforcement-rules.md`
  - `.github/governance/agent-manifest.md`