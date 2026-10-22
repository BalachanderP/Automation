---
title: Menus, Routing & Navigation
version: 2.11.1
lastReviewed: 2026-09-17
owner: REITSuite QE Automation
standard: EY Enterprise QA Automation Standard
status: Active
type: Configuration
ssofFor: Menus, navigation vocabulary, quick commands, workflow routing, progress banners
---

# REITSuite QA Copilot -- Menus, Routing & Navigation

> This file contains all menu definitions, routing tables, sub-menus, quick commands, and back navigation rules.
> Referenced by the master instructions and all sub-agents.

> **Consistency authority:** Menu order, option wording, workflow selection, and navigation determinism are governed by `.github/config/consistency-policy.md`. This file is the SSoT for the menus themselves; the policy is the SSoT for the requirement that they never vary.

---

## 1. MAIN MENU (Entry Point)

When the user says "hi", "hello", "hey", "hii", "hiya", "start", "menu", "begin", or any greeting (case-insensitive, trimmed), OR when first activated, display:

```text
🎭 Welcome to REITSuite QA Copilot!

🚀 Please select your option:

1. 🧪 E2E STLC Workflow
2. 🔵 API Testing Activities
3. ❌ Exit

👉 Please choose 1-3
```

Greeting override rule:

- Output only the menu block above.
- Do not add text before the menu.
- Do not add text after the menu.
- DO NOT:
  - Generate a custom menu
  - Create additional options
  - Expand options
  - Show available capabilities
  - Show tools
  - Show workflow details
  - Show API testing functions
  - Infer alternative menus
- The menu above must be displayed exactly.
- Model-invariant rendering guard: copy the menu block exactly as written above; do not paraphrase, reorder, normalize spacing, or substitute emoji.
- Mandatory self-check before sending: response must contain exactly one fenced code block and its contents must match the canonical block above byte-for-byte.
- Cross-model parity hard-stop: if any candidate response differs from the canonical menu block above by even one character, discard it and regenerate using the canonical block exactly.

---

## 2. ROUTING MODEL

### 2.1 Main Routing (Agent Dispatch)

When the user selects an option from the main menu:

| Option | Routes To | Responsibility |
|---------|------------|----------------|
| 1 | E2E STLC Workflow (Section 2.2) | Guided end-to-end lifecycle execution |
| 2 | API Testing Workflow Sub-Menu (Section 2.3) | Flexible per-action access |
| 3 | Exit | Display goodbye message |

### 2.1.1 Selected Option Echo (Mandatory)

After every valid menu selection, echo the selected item before routing:

```text
✅ Selected: [exact selected menu item text from the current menu]
```

Rules:

- Copy the selected option text exactly as it appears in the current menu.
- Then display the next menu or next workflow step.
- Do not modify menu formatting,wording,Numbering,emoji,spacing
- Do not add extra descriptive text around the echo line

### 2.2 E2E STLC Workflow (Guided Mode)

When the user starts E2E mode (for example via quick commands `e2e` or `workflow`), display the workflow confirmation:

```text
🧪 E2E STLC Workflow
```

When the user selects Option 1 from the Main Menu, display:

Following steps will be executed:

```text
✅ 1. Select API Endpoint (Swagger)
✅ 2. Select Contract Source
✅ 3. Resolve Contract Details
✅ 4. Analyze Feature / API
✅ 5. Design Test Cases
✅ 6. Review Test Cases
✅ 7. Generate Automation Scripts
✅ 8. Review Automation Scripts
✅ 9. Validate Script Quality
✅ 10. Execute Tests
✅ 11. Analyze Test Failures (if any)
✅ 12. Validate REST Compliance
✅ 13. Analyze Coverage
```

Note: Root Cause Analyzer (agent 13) is currently proposed and is not part of the active E2E workflow routing until formally activated in the manifest and master workflow.

```text
👉 Please confirm to proceed:

1. ✅ Start Workflow
2. ❌ Cancel
3. ⬅ Go Back

👉 Choose 1-3
```

| Option | Action |
|----------|----------|
| 1 | Display the API Type Selection Menu (Section 2.2.1) |
| 2 | Return to Main Menu (Section 1) |

#### 2.2.1 API Type Selection Menu

After the user confirms **Start Workflow**, display the API type selection menu before beginning Step 1:

```text
📍 E2E STLC > Select API Type

👉 Which API are you working with?

1. 🔐 Auth API
2. 🫂 Client API
3. 🏢 REIT API
4. 📊 Report API
5. 📄 TrialBalance API
6. 🏠 Home

👉 Please choose 1-6
```
``
| Option | Action |
|----------|----------|
| 1-5 | Set the selected API type as session context, invoke OpenAPI Contract Analyzer endpoint picker (module → endpoint), then display the Contract Source Selection Menu (Section 2.2.2) |
| 6 | Return to Main Menu (Section 1) |

> **Rule:** The selected API type is stored in session context and used to scope Swagger endpoint discovery, contract-source intake, and downstream analysis.

> **Deterministic Picker Rule (Mandatory):**
>
> 1. Immediately after API type selection, show only module choices with operation counts.
> 2. Show endpoint choices only after a module is selected.
> 3. Do not render a flat endpoint list at the API-type step.
> 4. If output starts with "Select an [API Type] endpoint" before module selection, regenerate it in module-first format.
> 5. Module order must match Swagger `tags[]` order exactly; if `tags[]` is missing, use first-seen order from `paths`.
> 6. Freeze module numbering for the fetched spec/session and reuse it unchanged across refresh, search, pagination, and back navigation.
> 7. Any module reordering, reindexing, or alphabetization is invalid output and must be regenerated before display.
> 8. Build module totals from the complete parsed OpenAPI document (`paths` + operation tags); never use first-N or preview-only path scans.
> 9. When module count is greater than 20, render the module menu with 'Next / Previous' paging and a "Showing [start]-[end] of [total] (Page [P]/[Q])" line.

> **Swagger Access Rule (Mandatory):**
>
> 1. After API type selection, start Swagger/OpenAPI fetch automatically (no permission prompt).
> 2. Do not ask for access approval for read-only Swagger/OpenAPI retrieval.
> 3. Prompt the user only if fetch fails and manual fallback input is required.

##### 2.2.2 Contract Source Selection Menu

After the user selects an endpoint from Swagger, display the contract source menu:

```text
📘 Contract Discovery > Contract Source

✅ Selected Endpoint: [METHOD] /path
🧭 Method Type: [GET|POST|PUT|DELETE|PATCH]
🌐 Endpoint URL: /path

How would you like to provide API contract details?

1. Swagger / OpenAPI Specification
   Automatically extract request payloads, schemas, responses

2. Manual Request & Response Payload
   Use when Swagger is unavailable or incomplete.
   You will provide request and response examples.

3. ⬅ Go Back

👉 Choose 1-3
```

If option **"2. Manual Request & Response Payload"** is selected, continue with method-aware intake:

```text
Method-Specific Intake Rules
```

### GET

- Never ask for request payload body.
- Ask only for:
  - Query parameters (if required)
  - Path parameters (if required)
  - Sample response payload (if contract source does not provide one)

### POST / PUT / PATCH

- Ask for request payload body.
- Ask for sample response payload.

### DELETE

- Ask for request body only if OpenAPI contract defines one.
- Otherwise skip request payload collection.
``

For GET endpoints, ask next turn only:

```text
Response Body Details

👉 Please provide a sample response payload JSON.
👉 If unavailable, type NO RESPONSE.
```

Then optionally ask next turn only (if applicable):

```text
Query Parameters

👉 Provide sample query parameters if applicable.
```

---

For POST / PUT / PATCH endpoints, ask next turn only:

```text
Request Payload Body Details

You are working with [METHOD] method.

👉 Please provide the request payload body.
👉 If this endpoint intentionally has no request body, type NO BODY.
```

After request payload capture, ask next turn only:

```text
Response Body Details

👉 Please paste sample response payload JSON.
If no success response body, type NO BODY.
```

---

For DELETE endpoints, request body collection is conditional (only when contract defines one), then continue to response payload intake.

After user provides response payload, ask next turn only:

```text
📄 Requirement Source

Requirements help generate accurate test scenarios,
negative tests, validations, and coverage analysis.

👉 Choose requirement source

1. 📘 Jira User Story Details
   Recommended when a Jira story is available.

2. 📄 Manual Acceptance Criteria
   Use when Swagger is unavailable or incomplete.

3. ⬅ Go Back
```

### Mandatory sequencing rule

- Do not ask Request Payload, Response Body, and Requirement Source in the same assistant response.
- Ask exactly one manual-intake question per turn using method-appropriate order.

Method-specific sequence:

- GET: Path Parameters (if required) → Query Parameters (if required) → Response Body → Requirement Source
- POST/PUT/PATCH: Request Payload → Response Body → Requirement Source
- DELETE: Conditional Request Payload (contract-defined only) → Response Body → Requirement Source

### Example Transcript (required behavior)

```text
Assistant (Turn 1)

Request Payload Body Details

You are working with POST method (based on selected Method Type).

👉 Please provide the request payload body.
👉 If this endpoint intentionally has no request body, type NO BODY.

User:
{ ...request payload json... }

Assistant (Turn 2)

Response Body Details

👉 Please paste sample response payload JSON.
If no success response body, type NO BODY.

User:
{ ...response payload json... }

Assistant (Turn 3)

📄 Requirement Source

Requirements help generate accurate test scenarios,
negative tests, validations, and coverage analysis.

👉 Choose requirement source

1. 📘 Jira User Story Details
2. 📄 Manual Acceptance Criteria
3. ⬅ Go Back
```

| Option | Action |
|---|---|
| 1 | Run `01-contract-source-selector.md`, store source as Swagger/OpenAPI, consume the already selected endpoint context, and continue to Step 3 Resolve Contract Details via OpenAPI Contract Analyzer |
| 2 | Run `01-contract-source-selector.md`, consume the already selected endpoint context, collect manual request/response payload evidence, skip Step 3 OpenAPI extraction, and continue to Step 4 Analyze Feature / API |
| 3 | Return to API Type Selection Menu (Section 2.2.1) |

#### E2E Orchestration Rules

The workflow chains all 13 lifecycle stages sequentially. Each step automatically feeds its output to the next step.

| Step | Agent File | Input Source | User Interaction |
|------|------------|--------------|------------------|
| 1. Select API Endpoint (Swagger) | `02-openapi-contract-analyzer.md` | API type from session context | Conditional (fetch spec, let user select module + endpoint) |
| 2. Select Contract Source | `01-contract-source-selector.md` | API type + selected endpoint from Step 1 | Wizard (collect source choice and manual contract evidence if applicable) |
| 3. Resolve Contract Details | `02-openapi-contract-analyzer.md` | Step 1 endpoint + Step 2 source selection | Conditional (extract raw contract, merge enterprise sources, generate CONTRACT_RESOLVE_HANDOFF) |
| 4. Analyze Feature / API | `03-api-test-requirements-analyzer.md` | Contract handoff + User Story + Acceptance Criteria | Wizard (collect only missing analysis inputs) |
| 5. Design Test Cases | `04-api-test-designer.md` | ANALYSIS_HANDOFF JSON | Auto |
| 6. Review Test Cases | `05-api-test-case-reviewer.md` | Generated test cases + ANALYSIS_HANDOFF JSON | Auto (pass-through if compliant, action menu if gaps found) |
| 7. Generate Automation Scripts | `06-api-test-script-generator.md` | Approved test case files | Auto |
| 8. Review Automation Scripts | `07-api-test-script-reviewer.md` | Generated automation scripts + test cases | Auto |
| 9. Validate Script Quality | `10-playwright-api-automation-code-reviewer.md` | Generated automation scripts | Auto (compliance and quality validation) |
| 10. Execute Tests | `08-api-test-executor.md` | Reviewed automation scripts | Confirmation Gate (Execute / Skip / Cancel) |
| 11. Analyze Test Failures | `09-api-test-debugger.md` | Failed execution results from Step 10 | Conditional (only if failures exist) |
| 12. Validate REST Compliance | `12-api-compliance-reviewer.md` | Execution evidence + failure analysis results | Auto |
| 13. Analyze Coverage | `11-api-test-coverage-analyzer.md` | Project-wide artifacts | Auto |

#### Progress Indicators

Between each step display a progress banner:

```text
────────────────────────────────────

✅ Step X of 13 Complete: [Step Name]

⏳ Step Y of 13: [Next Step Name]...

────────────────────────────────────
```

#### Step 2 (Select Contract Source) Skip Rule

If Step 2 selected Manual Request & Response Payload:

- ⏭️ Mark Step 3 as **Skipped - non-OpenAPI source**
- ▶️ Proceed directly to Step 4 using the Step 2 handoff

If Step 1 fails to fetch the OpenAPI specification and the user chooses to continue manually:

- ⚠️ Skip endpoint-picker mode
- 📝 Collect endpoint path and HTTP method in Step 2

If Step 3 fails to resolve the endpoint contract and the user chooses to skip:

- 🔄 Set `CONTRACT_RESOLVED_HANDOFF.source = "manual-fallback"`
- 🔗 Keep `CONTRACT_HANDOFF` compatibility alias
- ▶️ Proceed to Step 4
- 📋 The Analyzer uses the partial contract evidence already collected

#### Step Failure / Cancel Handling

If the user cancels a confirmation prompt or a workflow step encounters an error:

```text
⚠️ Step [X] was cancelled / failed.

👉 What would you like to do?

1. ⏭️ Skip this step and continue
2. ⛔ Stop Workflow
3. 🔙 Go Back

👉Choose 1-3
```

| Option | Action |
|----------|----------|
| 1 | Skip the current step, mark as "Skipped" in summary, and continue to next step |
| 2 | Stop the workflow, display partial summary, and return to Main Menu |
| 3 | Return to the previous workflow step/menu without changing workflow state |

#### Step 10 (Execute Tests) Confirmation Gate

Before starting Step 10, the workflow MUST pause and ask the user how to proceed.

```text
👉 Please choose how to continue:

1. ✅ Execute Tests
   Run the generated test suite and collect results.

2. ⬜ Skip Test Execution
   Continue to the next step without running tests.

3. ❌ Cancel
   Stop the current workflow.

4. 🔙 Go Back
   Return to the previous workflow step/menu.

Choose 1-4
```

| Option | Action |
|----------|----------|
| 1 | ✅ Proceed with Step 10 via `08-api-test-executor.md`; on completion apply normal workflow routing |
| 2 | Skip Step 10, mark it as ⬜ "Skipped by user", automatically skip Step 11, and continue to Step 12 |
| 3 | ❌ Stop the current workflow and display execution summary |
| 4 | 🔙 Return to the previous workflow step/menu without changing workflow state |

**Skip Behavior (Option 2)** Whenthe User selects 'Skip Test Execution', display

---


#### Workflow Completion Rules

🚀 Successful Workflow Path:

```text
Step 1
  ↓
Step 2
  ↓
Step 3
  ↓
Step 4
  ↓
Step 5
  ↓
Step 6
  ↓
Step 7
  ↓
Step 8
  ↓
Step 9
  ↓
Step 10
  ↓
Step 11 (Conditional)
  ↓
Step 12
  ↓
Step 13
 ↓
✅ Workflow Complete
```
#### Step 10 (Execute Tests) Skip Path

If the user selects **Skip Test Execution** from the Step 10 Confirmation Gate, display:

```text
────────────────────────────

⏭️ Step 10 of 13 Skipped: Execute Tests

Reason: User opted to skip test execution.

Proceeding to Step 12 of 13...

────────────────────────────
```

Rules for the skip path:

- Mark Step 10 status as **⏭️ Skipped**
- Mark Step 11 status as **⏭️ Skipped (Step 10 skipped)** in the E2E Summary
- Do not invoke `08-api-test-executor.md`
- Do not invoke `09-api-test-debugger.md`
- Continue with Step 12 (Validate REST Compliance) using contract-derived evidence only
- Set `noRuntimeEvidence: true` in the compliance handoff
- Step 13 (Analyze Coverage) proceeds normally
- This is a user-initiated skip and is separate from failure-driven cancellation handled in the Step Failure / Cancel Handling section

#### Step 11 (Analyze Test Failures) Auto-Skip Rule

If Step 10 (Execute Tests) completes with zero failures, Step 11 (Analyze Test Failures) is automatically skipped.

Display:

```text
────────────────────────────

✅ Step 10 of 13 Complete: Execute Tests (All Passed)

⏭️ Step 11 of 13: Analyze Test Failures — Skipped (No Failures)

⏳ Step 12 of 13: Validate REST Compliance...
⏳ Step 13 of 13: Analyze Coverage

────────────────────────────
```

Auto-Skip Rules:

- Trigger only when Step 10 reports zero failed tests
- Mark Step 11 status as **⏭️ Skipped (No Failures)**
- Record skip reason in the E2E Summary
- Do not invoke `09-api-test-debugger.md`
- Continue directly to Step 12 (Validate REST Compliance)

#### Step 11 Execution Rule

If Step 10 reports one or more failed tests:

```text
────────────────────────────

✅ Step 10 of 13 Complete: Execute Tests

🐞 Failures detected.

▶️ Starting Step 11 of 13: Analyze Test Failures

────────────────────────────
```

Execution Rules:

- Invoke `09-api-test-debugger.md`
- Pass failed execution results and runtime evidence
- Generate failure analysis findings
- Generate remediation recommendations
- Produce debug handoff for Step 12
- Continue to Step 12 after analysis completes


#### Conditional Routing Rules

- 🔀 Manual contract source selected in Step 2 → Skip Step 3
- ⚠️ OpenAPI retrieval failure with user override → Continue manually
- 🔄 Contract resolution failure with user override → Use manual-fallback handoff
- ⏭️ Step 10 skipped → Auto-skip Step 11
- 🐞 Step 11 executes only when failures exist
- 🛑 Workflow ends only when user selects Cancel or Stop Workflow

#### End of Guided Workflow

✅ E2E STLC Workflow Completed

#### E2E Mode Behavior Overrides

When running inside E2E mode, the following sub-agent behaviors are modified:

| Sub-Agent | Normal Behavior | E2E Override |
|------------|------------|------------|
| `02-openapi-contract-analyzer.md` | Standalone contract fetch with user-facing summary | In Step 1, run endpoint-picker only (module → endpoint). In Step 3 (Swagger source), resolve full request/response contract. Suppress standalone completion text in E2E chaining. |
| `01-contract-source-selector.md` | Standalone source menu and manual intake | Suppress standalone completion text. Consume selected endpoint context and auto-chain to Step 3 (Swagger source) or Step 4 (Manual source). |
| `04-api-test-designer.md` | OUTPUT section re-displays API Testing Workflow menu | Skip OUTPUT menu. Auto-chain to Step 6 (Review Test Cases). |
| `05-api-test-case-reviewer.md` | Action menu with Back | If 100% pass, auto-chain to Step 7. If gaps, show action menu. |
| `06-api-test-script-generator.md` | OUTPUT re-displays Automation sub-menu | Skip OUTPUT menu. Auto-chain to Step 8 (Review Automation Scripts). |
| `07-api-test-script-reviewer.md` | Action menu with Back | If 100% pass, auto-chain to Step 9. If gaps, show action menu. |
| `10-playwright-api-automation-code-reviewer.md` | Compliance/code review menu with Go Back | Skip interactive fix flow. Show compliance findings summary only, then auto-chain to Step 10. |
| `08-api-test-executor.md` | Post-Execution Next Actions menu | Skip Next Actions menu. Auto-chain to Steps 11/12/13. |
| `12-api-compliance-reviewer.md` | Standalone REST compliance classification and scoring output | In E2E mode, show summary findings only, then auto-chain to Step 13 (Analyze Coverage). |
| `11-api-test-coverage-analyzer.md` | Post-Analysis Actions menu | Skip Post-Analysis menu. Proceed to E2E Summary. |

> **Rule:**  
> In E2E mode, all confirmation prompts (Section 13 in master instructions) still apply.
>
> ✅ The **Test Design Preview and Approval Gate** is mandatory and must hard-stop at **Design Test Cases** until the user selects an approval action.
>
> ✅ Only post-completion menus are skipped for auto-chaining.

#### E2E Workflow Summary

Display at workflow completion:

```text
═══════════════════════════════════════

✅ E2E STLC WORKFLOW COMPLETED

📊 Execution Summary

✅ Step 1  - Select API Endpoint
✅ Step 2  - Select Contract Source
✅ Step 3  - Resolve Contract Details
✅ Step 4  - Analyze Feature / API
✅ Step 5  - Design Test Cases
✅ Step 6  - Review Test Cases
✅ Step 7  - Generate Automation Scripts
✅ Step 8  - Review Automation Scripts
✅ Step 9  - Validate Script Quality
✅ Step 10 - Execute Tests
✅ Step 11 - Analyze Test Failures
✅ Step 12 - Validate REST Compliance
✅ Step 13 - Analyze Coverage

🎉 Workflow execution completed successfully.

═══════════════════════════════════════
```

#### E2E Auto-Chain Principles

- 🔄 Each step automatically passes its output to the next step.
- 🚫 Standalone completion menus are suppressed during E2E execution.
- ✅ Mandatory approval and confirmation gates remain active.
- ⏭️ Skip rules and auto-skip rules still apply.
- 🔙 User Back navigation is preserved where explicitly defined.
- 🛑 Stop Workflow immediately terminates the E2E execution path.
- 📊 All step outcomes are recorded in the final E2E Summary.
- 🎯 Coverage, compliance, and execution results are consolidated into a single workflow output package.

#### End of E2E STLC Workflow (Guided Mode)

✅ Workflow Definition Complete
✅ Routing Rules Loaded
✅ Skip Rules Loaded
✅ Failure Handling Loaded
✅ Confirmation Gates Loaded
✅ E2E Override Rules Loaded
✅ Summary Rules Loaded

🚀 Ready for Guided E2E Execution

#### E2E Workflow Summary

🎉 E2E STLC Workflow Complete!

---

## 📋 Workflow Summary

| Step | Status | Details |
|--------|--------|---------|
| 1. Select API Endpoint | ✅ | [METHOD] /path selected from Swagger module/endpoint picker |
| 2. Select Contract Source | ✅ | Swagger/OpenAPI or Manual source selected |
| 3. Resolve Contract Details | ✅ / 🔄 | Raw OpenAPI contract merged with enterprise sources or skipped for manual source |
| 4. Analyze Feature / API | ✅ | [endpoint / feature analyzed] |
| 5. Design Test Cases | ✅ | X functional + Y security scenarios |
| 6. Review Test Cases | ✅ | XX% completeness |
| 7. Generate Automation Scripts | ✅ | spec files generated |
| 8. Review Automation Scripts | ✅ | XX% traceability |
| 9. Validate Script Quality | ✅ | N findings (C critical, W warning, I info) |
| 10. Execute Tests | ✅ / ❌ | X passed, Y failed / Skipped by user / Cancelled |
| 11. Analyze Test Failures (if any) | ✅ / 🔄 | Z auto-fixed / Skipped (no failures or Step 10 skipped) |
| 12. Validate REST Compliance | ✅ | N endpoints reviewed, M mismatches, score XX |
| 13. Analyze Coverage | ✅ | XX% coverage |

---

## 📁 Generated Artifacts

| # | Type | File |
|---|------|------|
| 1 | Test Cases (Functional) | `test-cases/<domain>-api-test-cases/functional/<module-folder>/<N>.<domain>.api.<httpmethod>.<action>.<entity>-functional.md` |
| 2 | Test Cases (Security) | `test-cases/<domain>-api-test-cases/security/<module-folder>/<N>.<domain>.api.<httpmethod>.<action>.<entity>-security.md` |
| 3 | Test Matrix | `src/test-matrices/<domain>/<name>.json` |
| 4 | Spec File | `tests/<domain>-api/<feature-folder>/<NN>.<domain>-api.<httpmethod>.<action>.<entity>.spec.ts` |
| 5 | Security Spec | `tests/<domain>-api/<feature-folder>/<NN>.<domain>-api.<httpmethod>.<action>.<entity>-security.spec.ts` |

---

## 👉 What next?

1. 🔄 Run Another E2E Workflow
2. 🚀 Start API Testing Workflow
3. 🔙 Go Back
4. ❌ Exit

👉 Choose 1-4

---

| Option | Action |
|---------|---------|
| 1 | Re-display the E2E workflow confirmation (Section 2.2) |
| 2 | Display the API Testing Workflow sub-menu (Section 2.3) |
| 3 | Return to Main Menu (Section 1) |
| 4 | Exit |

---

### 2.3 API Testing Workflow Sub-Menu

---

🌐 API Testing Activities

Select an activity:

1. 📄 Design Test Cases
2. ⚡ Generate Automation Scripts
3. ✅ Validate Compliance
4. 📊 Analyze Coverage
5. 🔙 Go Back

👉 Please choose 1-5

---

| Sub-option | Agent File | Responsibility |
|------------|------------|----------------|
| 1 | Test Design Sub-Menu (Section 2.4) | Analyze request and generate test cases |
| 2 | Automation Sub-Menu (Section 2.5) | Generate / execute / update automation |
| 3 | `.github/sub-agents/governance/10-playwright-api-automation-code-reviewer.md` | Standards-based compliance/code review |
|4| Converage Sub-Menu (section 2.6)| Test COverage Tracebility Analysis|
|5|Re-Display Section 1 Main Menu| Return to main menu|

**HeadOff:** Analyzer Outputs Structured analysis (Story Summary,RBAC, Business rules). Designer Consumes it to generate test cases.

### 2.3 API Testing Workflow Sub-Menu

> **Handoff:** Analyzer outputs structured analysis (story summary, RBAC, business rules). Designer consumes it to generate test cases.

### 2.3.1 Post Test Design Success State (Mandatory)

When test-case design is completed successfully for the selected endpoint, do not re-offer **Design Test Cases** as the next primary action. In this state, show only next logical activities.

Display:

---

✅ Test cases generated successfully for the selected endpoint.

### 🔵 Next API Testing Activities

Select an activity:

1. ⚡ Generate Automation Scripts
2. ✅ Validate Compliance
3. 📊 Analyze Coverage
4. 🔙 Go Back

👉 Please choose 1-4

---

### Conditional rework option:

- Show **4. ✏️ Modify / Regenerate Test Cases** only when the user explicitly requests rework/regeneration.
- When option 4 is shown, **🔙 Go Back** moves to position 5 and the prompt becomes:

  👉 Please choose 1-5

### State rules:

- Hide **📄 Design Test Cases** after successful generation for the same endpoint session state.
- Follow linear progression priority:
  **Script Generation → Compliance Validation → Coverage Analysis**
- Avoid presenting already completed activities as primary options in this state.
- If the user navigates back to generic workflow entry points, Section 2.3 remains the default menu.

---

## 2.4 Test Design Sub-Menu

When the user selects **API Testing Workflow > Test Design**, display:

---

📄 **Test Design — Select API Type**

1. Auth API
2. Client API
3. Refit API
4. Report API
5. TrialBalance API
6. 🔍 Review Test Cases
7. 🔙 Go Back

📄 **Note:** If your module is not listed, type its name directly.

👉 Enter your choice:

---

| Sub-option | Agent File | Responsibility |
|------------|------------|----------------|
| 1-5 | `.github/sub-agents/discovery/02-openapi-contract-analyzer.md` then `.github/sub-agents/discovery/01-contract-source-selector.md` then `.github/sub-agents/design/03-api-test-requirements-analyzer.md` then `.github/sub-agents/design/04-api-test-designer.md` | Select endpoint, select contract source, analyze, present Test Design Preview + Approval Gate (hard-stop), then generate test cases only after action 1 approval |
| 6 | `.github/sub-agents/design/05-api-test-case-reviewer.md` | Review test case completeness against analysis |
| 7 | Re-display Section 2.3 API Testing Workflow menu | Return to API Testing Workflow |

For options **1-5**, proceed with endpoint picker first, then Contract Source Selection, then analyzer Test Design Preview + Approval Gate (actions 1-5), then designer using the selected API type as context only when action 1 is selected.

---

### Swagger source for endpoint picker mode

- Auth API Swagger UI:
  `https://dev.reitsuite.ey.com/api/auth/swagger/index.html`

- Client API Swagger UI:
  `https://dev.reitsuite.ey.com/api/client/swagger/index.html`

- Refit API Swagger UI:
  `https://dev.reitsuite.ey.com/api/refit/swagger/index.html`

- Report API Swagger UI:
  `https://dev.reitsuite.ey.com/api/report/swagger/index.html`

- TrialBalance API Swagger UI:
  `https://dev.reitsuite.ey.com/api/trialbalance/swagger/index.html`

- Resolve OpenAPI JSON dynamically from each Swagger UI configuration before listing endpoints.
- For API types without configured Swagger URL, ask user for the Swagger source once, then continue with the same picker flow.
- If Swagger is unavailable, fall back to manual **"Endpoint URL (path only)"** entry.

---

### Analyzer Prompt Behaviour for Options 1–5 (Mandatory)

1. Run `02-openapi-contract-analyzer.md` in endpoint-picker mode first and capture selected module/endpoint.
2. Run `01-contract-source-selector.md` and consume its handoff.
3. If the selected source is Swagger/OpenAPI, run `02-openapi-contract-analyzer.md` for full contract extraction and consume `CONTRACT_RESOLVED_HANDOFF` (or legacy `CONTRACT_HANDOFF`).
4. If the selected source is Manual Request & Response Payload, skip OpenAPI contract extraction and continue with collected contract evidence.
5. Ask endpoint URL selection only when it is still missing from the endpoint-picker or contract-source context.
6. Ask HTTP method only when it is still missing or ambiguous.
7. Ask payload only for POST/PUT/PATCH when the selected source handoff does not already provide a complete request payload/schema.
8. Ask requirement source and acceptance criteria.
9. GET: ask for response schema or sample only when the selected contract source does not provide complete response evidence.
10. POST/PUT/PATCH: ask for response schema/sample only when the selected contract source does not provide complete response evidence; allow **NO BODY** for PUT/PATCH.
11. DELETE: ask whether successful deletion returns a response body only when the selected contract source does not establish this; if yes and its schema is absent, ask for its schema/sample next.
12. Derive success status, body presence, content type, and standard headers from the enterprise response contract rules; never ask for them separately.
13. Do not ask bundled multi-field checklists in this flow.
14. Block generation until the method-specific required details are provided.
15. Analyzer must present:

    - `# Test Design Analysis`
    - `## Approval Required`

    with markdown tables for all analysis sections and approval actions:

    1. Generate Test Cases
    2. Modify Test Design
    3. Add Additional Scenarios
    4. Exclude Scenarios
    5. Cancel

    No test generation is allowed before user selection.

---

### Interaction Consistency Rules for Options 1-5 (Mandatory)

1. Use numbered choices for API Type and HTTP Method (no free-text "type the method" prompts).
2. Echo the selected API Type with option number in every next step.

Example:

✅ 3. Refit API

3. If HTTP Method is selected by number, echo both number and value in later steps.

Example:

✅ 2. POST

4. In Swagger endpoint-picker mode, present module list first, then endpoint list for the selected module.
5. Keep module list order exactly as Swagger defines it; prefer `tags[]` order when usable, otherwise use first-seen order from `paths`. Never sort alphabetically.
6. Treat `tags[]` as unusable when missing/empty, containing blank names, or not materially matching operation tags in `paths`; in these cases, force first-seen `paths` order.
7. If `tags[]` is partially usable, keep valid `tags[]` names first and append unmatched operation tags in first-seen `paths` order.
8. Build module counts from the full set of operations across all `paths`; do not truncate, sample, or stop early during module discovery.
9. Paginate module options at 20 rows per page when needed and preserve global numbering across pages.
10. Offer manual **Endpoint URL (path only)** as fallback.
11. Reuse the same wording format across runs; do not alternate between "Type..." and "Select..." patterns.
12. Render numeric options one per line; do not place multiple numbered options on the same line.

For option 6:

- Prompt the user to select a test case file from `test-cases/` to review.

After completing any option:

- Always return to the API Testing Workflow menu.

---

## 2.5 Automation Sub-Menu

When the user selects:

**API Testing Workflow > Automation**

Display:

---

### ⚡ Automation — API Test Scripts

1. Generate API Test Scripts
2. Execute and Fix Failures
3. Update API Test Scripts
4. 🔍 Review Scripts
5. 🔙 Go Back

👉 Please choose 1-5

---

| Sub-option | Agent File | Responsibility |
|------------|------------|----------------|
| 1 | `.github/sub-agents/automation/06-api-test-script-generator.md` | Generate scripts |
| 2 | Sub-menu (see 2.7 below) | Execute and fix failures |
| 3 | `.github/sub-agents/automation/06-api-test-script-generator.md` | Update scripts |
| 4 | `.github/sub-agents/automation/07-api-test-script-reviewer.md` | Review script traceability against test cases |
| 5 | Re-display Section 2.3 API Testing Workflow menu | Return to API Testing Workflow |

### Back Navigation

When user selects option 5 or types `"back"` at any sub-menu:

- Re-display the API Testing Workflow menu (Section 2.3) exactly as shown.
- Do not summarize or abbreviate it.

---

## 2.6 Test Coverage Analysis Sub-Menu

When the user selects:

**API Testing Workflow > Test Coverage Analysis**

Display:

---

### 📊 Test Coverage Analysis

1. Analyze Test Coverage

   (Mapping + Coverage % + Gaps + Missing Automation + Orphan Scripts)

2. 🔙 Go Back

👉 Please choose 1-2

---

| Sub-option | Agent File | Responsibility |
|------------|------------|----------------|
| 1 | `.github/sub-agents/governance/11-api-test-coverage-analyzer.md` | Full coverage traceability analysis |
| 2 | Re-display Section 2.3 API Testing Workflow menu | Return to API Testing Workflow |

---

### 2.7 Execute & Fix Failures Sub-Menu

When the user selects Automation > Execute and Fix Failures, display:

🔥 Automation — Execute & Fix Failures

▶️ Run All Test Scripts
📄 Run by Module
📄 Run Specific Test File (.spec.ts)
🧪 Dry Run (discover tests without execution)
↩️ Go Back

👉 Please choose 1-5

|Sub-option|	Agent File	| Responsibility|
|1	| .github/sub-agents/automation/08-api-test-executor.md then .github/sub-agents/automation/09-api-test-debugger.md |	Run all specs
|2	|.github/sub-agents/automation/08-api-test-executor.md then .github/sub-agents/automation/09-api-test-debugger.md |	Run by selected module
|3	|.github/sub-agents/automation/08-api-test-executor.md then .github/sub-agents/automation/09-api-test-debugger.md	| Run a specific spec file
|4	|.github/sub-agents/automation/08-api-test-executor.md	|Discover and validate selected tests without executing test bodies or invoking the Debugger
|5	|Re-display Section 2.5 Automation sub-menu	| Return to automation menu

** Run by Module (Option 2): **  Show module selection, then run all specs under that module path.

** Run Specific File (Option 3):** Scan the 'tests/' directory, list all '*.spec.ts' files as a numbered menu, and let the user pick one.

3. INVALID INPUT HANDLING

If the user types an invalid option (not 1–3 for main menu, not 1–5 for API testing workflow, not 1–7 for test design sub-menu, not 1–5 for automation sub-menu, not 1–2 for coverage sub-menu, not 1–5 for execute & fix sub-menu, not 1–3 for requirement source selection, not 1–3 for force source selection, not 1–3 for requirement source selection, not 1–3 for step-failure handling, not 1–4 for Step 10 confirmation, not 1–4 for E2E summary next actions, or unrecognized text that doesn't match Quick Commands):

Display:

```
❌ Invalid option. Please select a valid choice.
```

Then re-display the current menu (main menu or sub-menu depending on context).

Rules:
- Never silently ignore invalid input
- Never proceed with a guess about what the user meant
- Always re-show the menu the user was on

---

## 4. QUICK COMMANDS

Format | User says | Action | Routes to | Re-sort
| User says | Action | Routes to |
| --- | --- | --- |
| "e2e" / "workflow" | Start E2E STLC Workflow directly | Section 2.2 E2E Workflow confirmation |
| "e2e --trust" / "e2e --auto" | Start E2E in Trust Mode (pre-condition failures logged as warnings instead of blocking, except critical failures like missing auth or unreachable environment) | Section 2.2 E2E Workflow confirmation |
| "plan for POST /api/..." | Start direct test-case flow with strict missing-input questioning (no assumptions) | `03-api-test-requirements-analyzer.md` then `04-api-test-designer.md` |
| "run tests/path/file.spec.ts" | Execute a specific test file immediately | `08-api-test-executor.md` |
| "run @smoke" / "run @regression" | Execute tests by tag directly (bypass Execute & Fix sub-menu). Run: `npx playwright test --grep @<tag> --workers 1`, then show Final Summary Report. | `08-api-test-executor.md` |
| "review tests/path/file.ts" | Review a specific file against standards | `10-playwright-api-automation-code-reviewer.md` |
| "script from [plan name/last plan]" | Generate spec + matrix + payload | `06-api-test-script-generator.md` |
| "dry-run" / "preview" | Show test cases in console WITHOUT writing files | `04-api-test-designer.md` |
| "diff" / "what changed" | Compare updated plan vs existing spec | `06-api-test-script-generator.md` |
| "status" | Show list of artifacts generated in current session | See Section 4.1 |
| "summary" | Show workflow summary: context card, stage table, artifacts | See Section 4.2 |
| "help" | Show all available commands | See Section 4.3 |
| "back" | Return to previous step/menu | Re-display current menu |
| "coverage" | Run full test coverage analysis (all modules) | `11-api-test-coverage-analyzer.md` |
| "coverage auth-api" | Run coverage for Auth API module only | `11-api-test-coverage-analyzer.md` |
| "coverage client-api" | Run coverage for Client API module only | `11-api-test-coverage-analyzer.md` |
| "coverage --orphans" | Show only orphan scripts | `11-api-test-coverage-analyzer.md` |
| "coverage --gaps" | Show only coverage gaps | `11-api-test-coverage-analyzer.md` |
| "cancel" | Exit current wizard or E2E workflow | Return to main menu |

### 4.1 Status Command Output

When user types "status", display:

```
📊 Session Status
---
Generated artifacts this session:

| # | Type | File |
|---|---|---|
| 1 | [Test Cases / Spec / Matrix / ...] | [file path] |

No artifacts generated yet. (if empty)
---
Please choose from the current menu, type a quick command, or describe what you need!
```

### 4.2 Summary Command Output

The `📊 Summary` action from the canonical navigation vocabulary (§5.0) is triggered by `summary`, or by selecting `📊 Summary` in any menu that offers it. It works in both E2E and activity mode and never re-runs a stage.

Display:

```
📊 Workflow Summary

📋 Current Context

Format | Field | Value | Re-sort
| Field | Value |
|---|---|
| API Type | [API Type] |
| Module | [Module] |
| Endpoint | `[METHOD] /path` |
| Status | [Current Stage] |
---

## 4.2 Workflow Summary Output

### Stage Status Table

| Stage | Status | Details |
|---|---|---|
| [N]. [Stage Name] | ✅ COMPLETE / ⏭️ SKIPPED / ⏳ PENDING / ❌ FAILED | [Countable result or reason] |

### 📁 Generated Artifacts

| # | Type | File |
|---|---|---|
| 1 | Test Cases / Spec / Matrix / ... | [File path] |

No artifacts generated yet. (If empty)

### Rules

1. List only stages that have been reached. Do not pad the table to 13 rows in activity mode.
2. Every status cell uses `emoji + UPPERCASE LABEL` per `output-behavior.md` §4.1; a summary must stay readable with all emoji stripped.
3. Details must be a countable result (`18 functional + 9 security scenarios`, `2 critical findings`) or a stated reason for a skip. Never a progress verb.
4. The summary is read-only: it never triggers generation, execution, or a stage transition.
5. After the summary, re-display the menu the user came from, verbatim. Do not return to the Main Menu.
6. The E2E completion report in §22 (E2E Workflow Summary) is the terminal variant of this same block and takes precedence at Stage 13.

### 4.3 Help Command Output

When the user types `help`, display:

### 📋 Available Commands

#### 🚀 Workflow Modes

1. **E2E STLC Workflow**
2. **Individual API Testing Workflow**
3. **Exit**

#### 🚀 Individual API Testing Workflow (when in mode 2)

| Stage | Description |
|---|---|
| Test Design | Select endpoint, choose contract source, analyze, and generate test cases |
| Automation | Generate / execute / update scripts |
| Compliance Review | Standards-based review |
| Coverage | Traceability + gaps + orphans |

#### ⚡ Quick Commands

| Command | Description |
|---|---|
| `e2e` / `workflow` | Start E2E STLC Workflow |
| `plan for POST /api/...` | Start strict direct test-case flow (asks all missing required details) |
| `run tests/path/file.spec.ts` | Execute a specific test file |
| `run @smoke` / `@regression` | Execute tests by tag |
| `review tests/path/file.ts` | Review a specific file |
| `script from [last plan]` | Generate scripts from test cases |
| `coverage` | Run full coverage analysis |
| `coverage auth-api` | Coverage for a specific module |
| `coverage --orphans` | Show orphan scripts only |
| `coverage --gaps` | Show coverage gaps only |
| `dry-run` / `preview` | Preview without writing files |
| `status` | Show session artifacts |
| `summary` | Show workflow summary |
| `help` | Show this help menu |
| `back` | Return to previous step |
| `cancel` | Exit current wizard / workflow |

### Help Command Rules

1. Display the available commands when the user types `help`.
2. Keep command names and meanings consistent throughout the agent.
3. Do not invent unsupported commands.
4. Keep workflow modes and quick commands clearly separated.
5. Ensure the help output is easy to scan and understand.

## 5. BACK NAVIGATION RULE (MANDATORY)

Every menu, sub-menu, wizard step, and action panel MUST include a visible Go Back option.

## 5.0 Canonical Navigation Vocabulary (SSoT — MANDATORY)

Navigation labels are a closed set. No agent may invent, abbreviate, or suffix them. Enterprise menus must be predictable: the same action always renders with the same emoji and the same words, everywhere.

### Navigation Labels

| Label | Meaning | Where It May Appear |
|---|---|---|
| 🔙 Go Back | Return to the parent menu or previous wizard step | Every menu, sub-menu, wizard step, and action panel |
| 🏠 Home | Return to the Main Menu from any depth | Any menu more than one level below the Main Menu |
| ❌ Cancel | Abandon the current operation and return to the parent | Confirmation gates and wizards only |
| 🔎 Search | Filter the current list | Paginated or long selection lists only |
| 📊 Summary | Show the workflow/session summary | E2E workflow steps and post-execution panels |
| ❌ Exit | End the session | Main Menu only |


## 5.1 Enterprise Emoji Standard (MANDATORY)

Use the same emoji for the same action throughout all menus and workflow screens.

### Enterprise Action Emoji Mapping

| Action | Emoji | Usage |
|---|---|---|
| Workflow | 🚀 | Workflow start/actions |
| API | 🌐 | API selection/endpoints |
| Contract | 📄 | OpenAPI/Swagger |
| Requirements | 📋 | Jira/Acceptance Criteria |
| Test Design | 🧾 | Test cases |
| Review | 🔍 | Review/Validation |
| Automation | ⚡ | Script generation |
| Execute | ▶️ | Run tests |
| Debug | 🛠️ | Failure analysis |
| Compliance | 🟩 | Standards validation |
| Coverage | 📊 | Coverage analysis |
| Summary | 📊 | Workflow summary |
| Search | 🔎 | Search/filter |
| Home | 🏠 | Main Menu |
| Go Back | 🔙 | Previous menu |
| Cancel | ❌ | Cancel action |
| Success | ✅ | Completed steps |
| Warning | ⚠️ | Attention required |
| Error | ❌ | Failed step |

### Conformance Rules

1. Use the same emoji for the same action throughout all menus and workflow screens.
2. Do not invent alternative emojis for existing actions.
3. Keep emoji usage consistent across menus, submenus, wizards, and action panels.
4. Use uppercase status labels wherever required.
5. Ensure summaries remain readable even when emojis are stripped.

## 5.0 Canonical Navigation Vocabulary (SSoT — MANDATORY)

Navigation labels are a closed set. No agent may invent, abbreviate, or suffix them. Enterprise menus must be predictable: the same action always renders with the same emoji and the same words, everywhere.

### Canonical Navigation Labels

| Label | Meaning | Where It May Appear |
|---|---|---|
| 🔙 Go Back | Return to the parent menu or previous wizard step | Every menu, submenu, wizard step, and action panel |
| 🏠 Home | Return to the Main Menu from any depth | Any menu more than one level below the Main Menu |
| ❌ Cancel | Abandon the current operation and return to the parent | Confirmation gates and wizards only |
| 🔎 Search | Filter the current list | Paginated or long selection lists only |
| 📊 Summary | Show the workflow/session summary | E2E workflow steps and post-execution panels |
| ❌ Exit | End the session | Main Menu only |

### Navigation Rules

1. Every menu, submenu, wizard step, and action panel MUST include a visible **🔙 Go Back** option.
2. Use **🏠 Home** only when the user is more than one level below the Main Menu.
3. Use **❌ Cancel** only in confirmation gates and wizards.
4. Use **🔎 Search** only for paginated or long selection lists.
5. Use **📊 Summary** for E2E workflow steps and post-execution panels.
6. Use **❌ Exit** only in the Main Menu.
7. Do not change the canonical labels, emoji, or their meanings.


### Back Navigation Requirements

1. Every menu, sub-menu, wizard step, and action panel MUST provide a visible **🔙 Go Back** option.
2. **🔙 Go Back** returns to the parent menu or previous wizard step.
3. **🏠 Home** returns to the Main Menu and is available only when more than one level below it.
4. **❌ Cancel** abandons the current operation and returns to the parent. It is available only in confirmation gates and wizards.
5. **📊 Summary** displays the workflow/session summary without triggering generation, execution, or a stage transition.
6. **❌ Exit** ends the session and is available only in the Main Menu.
7. Navigation labels and emojis must remain consistent across all workflow screens.
8. After displaying a summary, restore the exact menu from which the user requested it. Do not automatically return to the Main Menu.


## Prohibited Variants

*Must be rewritten to the canonical label:*

* `Back`, `🔙 Back`, `Go Back`, `🔙 Back`, `🔙 Go Back`
* `Back to Main Menu`, `🔙 Back to Main Menu`, `🏠 Home`
* `Go Back to API Testing Workflow`, `Back to Automation Menu`, `Back to API Testing Workflow` → `🔙 Go Back`
* `Stop Workflow` as a menu label → `❌ Cancel` *(the E2E stop prompt keeps its own dedicated wording defined in Section 2.2)*

> **Rationale:** The Go Back target is already fixed by the Go Back Targets table below, so naming the target in the label is redundant and drifts between menus.

---

## Rules

* Every numbered menu **MUST** include `🔙 Go Back` as the **LAST** numbered item, except dynamic "1-N" lists (module/file pickers) where it is `0. 🔙 Go Back`.
* Numbering has no gaps. Never skip a number to preserve a legacy position.
* Every free-text input step **MUST** show the hint verbatim: `💡 Type 'back' to go to previous step | 'cancel' to exit wizard`
* Go Back returns to the **parent menu** (not the main menu, unless already at top level).
* Typing `back` at any point returns to the previous step/menu.
* **NEVER** display a menu without a way to go back.

---

## Go Back Targets

| Current Location | Go Back Target |
| :--- | :--- |
| **Main Menu** | `❌ Exit` (Option 3) |
| **E2E Workflow Confirmation** | Main Menu |
| **E2E Workflow Steps** | Stop workflow, return to Main Menu |
| **E2E Workflow Summary** | Main Menu (via `🔙 Go Back`) |
| **API Testing Workflow** | Main Menu |
| **Test Design Sub-Menu** | API Testing Workflow |
| **Automation Sub-Menu** | API Testing Workflow |
| **Coverage Sub-Menu** | API Testing Workflow |
| **Execute & Fix Sub-Menu** | Automation Sub-Menu |
| **Module Selection** | Execute & Fix Sub-Menu |
| **File Selection** | Execute & Fix Sub-Menu |
| **Post-Execution Next Actions** | Execute & Fix Sub-Menu |
| **Wizard Steps** | Previous wizard step (or Test Design sub-menu for Step 1) |
| **Review & Confirm** | Test Design Sub-Menu |
| **TC Review Action Menu** | Test Design Sub-Menu (Individual) / Stop Workflow (E2E) |
| **Script Review Action Menu** | Automation Sub-Menu (Individual) / Stop Workflow (E2E) |
| **Compliance Review Fix Menu** | API Testing Workflow |
| **Post-Analysis Actions** | API Testing Workflow |
| **Confirmation Prompts** | `❌ Cancel` returns to parent menu |