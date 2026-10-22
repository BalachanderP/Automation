---
title: Agent Manifest
version: 3.8.2
lastReviewed: 2026-09-14
owner: REITSuite QE Automation
standard: EY Enterprise QA Automation Standard
status: Active
type: Configuration
ssofFor: Agent registry, paths, versions, dependencies, ownership boundaries
---

# Agent Manifest - REITSuite QA Copilot API Testing

> **Consistency authority:** Agent-ownership determinism and routing-boundary stability are governed by `.github/config/consistency-policy.md`. This manifest is the SSoT for agent registry facts; the policy is the SSoT for the requirement that ownership decisions never vary for equivalent inputs.

## 1. Purpose

This file is the canonical registry of all active agents, knowledge files, configuration files, schemas, and registries used by the REITSuite QA Copilot API Testing system.

This file is a registry only.

This file defines:

- Agent names
- Agent file paths
- Agent versions
- Agent responsibilities
- Agent dependencies
- Agent status
- Configuration file ownership
- Knowledge base file ownership
- Schema and registry ownership
- Deprecated agent status

This file does not define:

- Menu wording
- Menu order
- User-visible response format
- Workflow step logic
- Approval behavior
- Test-generation rules
- Script-generation rules
- REST compliance logic
- Coverage scoring logic

Those responsibilities belong to their specific Source of truth files.

---
## 2. Single Source of Truth Boundaries

| Decision Area / Truth | Source Of Truth |
|----------------------|-----------------|
| Agent registry, versions, paths, dependencies, lifecycle status | `.github/governance/agent-manifest.md` |
| Menus, navigation, quick commands, workflow routing | `.github/governance/routing-policy.md` |
| User-visible output formatting and silent-processing rules | `.github/config/output-behavior.md` |
| Master orchestration and global governance | `.github/agents/reitsuite-api-master-agent.md` |
| Project architecture and folder responsibility | `.github/knowledge/architecture/architecture.md` |
| Coding standards and implementation rules | `.github/knowledge/standards/coding-standards.md` |
| Test standards, functional coverage, security coverage, SASP rules | `.github/knowledge/standards/test-standards.md` |
| Endpoint dependencies, entity setup, cleanup, builders | `.github/knowledge/registries/dependency-registry.json` |
| Validation taxonomy and input constraints | `.github/knowledge/registries/functional-validation-registry.json` |
| SASP applicability and security validation rules | `.github/knowledge/registries/security-validation-registry.json` |
| Handoff structure validation | `.github/knowledge/schemas/handoff.schema.json` |
| Stage-to-stage handoff artifacts | `.github/knowledge/handoffs/*.json` |

### Rules

- This manifest must not duplicate menu behavior from `routing-policy.md`.
- This manifest must not duplicate output rules from `output-behavior.md`.
- This manifest must not duplicate implementation standards from knowledge files.
- This manifest must be updated whenever an agent file path, version, responsibility, or status changes.
- If an agent is removed, replaced, or renamed, update the deprecated agents section.

---

## 3. Primary Agent

| Field | Value |
|--------|--------|
| Name | REITSuite QA Copilot - API Testing Master |
| File | `.github/agents/reitsuite-api-master-agent.md` |
| Version | 1.7.1.0 |
| Status | Active |
| Type | Master Orchestrator |
| Responsibility | Enterprise orchestration, workflow governance, routing control, approval gates, deterministic behavior enforcement, and sub-agent coordination |
| Depends On | `routing-policy.md`, `output-behavior.md`, `enforcement-rules.md`, `agent-manifest.md`, all active sub-agents, architecture, coding standards, test standards, registries |
| Must Not Own | Menu text, output templates, generated code implementation details, REST scoring, coverage scoring |

---
## 4. Operational Agents

### 4.1 Discovery Agents

| # | Agent | File | Version | Status | Responsibility | Dependencies |
|---|---|---|---|---|---|---|
| 1 | Contract Source Selector | `.github/sub-agents/discovery/01-contract-source-selector.md` | 1.1.2 | Active | Select contract source, collect method-aware manual contract evidence, and produce contract-source handoff | `routing-policy.md`, `output-behavior.md`, `test-standards.md` |
| 2 | OpenAPI Contract Analyzer and Contract Resolver | `.github/sub-agents/discovery/02-openapi-contract-analyzer.md` | 1.5.2 | Active | Fetch Swagger/OpenAPI, preserve module order, run endpoint picker, extract raw contract, merge enterprise registries, and produce resolved contract handoff | `architecture.md`, `test-standards.md`, `dependency-registry.json`, `endpoint-registry.json`, `business-rules-registry.json`, `ui-used-endpoints-analysis.json`, `functional-validation-registry.json`, `security-validation-registry.json` |

### 4.2 Test Design Agents

| # | Agent | File | Version | Status | Responsibility | Dependencies |
|---|---|---|---|---|---|---|
| 3 | Requirements Analysis Agent | `.github/sub-agents/design/03-api-test-requirements-analyzer.md` | 2.9.0 | Active | Analyze requirements, contract, RBAC, business rules, validation rules, and own all business clarification questions | `architecture.md`, `test-standards.md`, `dependency-registry.json`, `business-rules-registry.json`, `ui-used-endpoints-analysis.json`, `output-behavior.md` |
| 4 | Test Design Agent | `.github/sub-agents/design/04-api-test-designer.md` | 2.9.1 | Active | Generate functional and security test cases from completed analysis handoff without asking new business questions | `architecture.md`, `coding-standards.md`, `test-standards.md`, `dependency-registry.json`, `ui-used-endpoints-analysis.json`, `security-validation-registry.json` |
| 5 | Test Case Reviewer | `.github/sub-agents/design/05-api-test-case-reviewer.md` | 2.3.3 | Active | Review generated test cases for completeness, traceability, duplication, RBAC coverage, security coverage, and enterprise readiness | `test-standards.md`, `security-validation-registry.json` |

### 4.3 Automation Agents

| # | Agent | File | Version | Status | Responsibility | Dependencies |
|---|---|---|---|---|---|---|
| 6 | Automation Script Generation Agent | `.github/sub-agents/automation/06-api-test-script-generator.md` | 3.1.0 | Active | Generate Playwright TypeScript functional specs, security specs, matrices, service extensions, payload factories, schemas, and assertion usage according to framework standards | `architecture.md`, `coding-standards.md`, `test-standards.md`, `dependency-registry.json`, `business-rules-registry.json`, `ui-used-endpoints-analysis.json` |
| 7 | Automation Script Review Agent | `.github/sub-agents/automation/07-api-test-script-reviewer.md` | 3.1.2 | Active | Review generated scripts for test-case traceability, framework alignment, matrix usage, role coverage, assertion usage, and functional/security separation | `coding-standards.md`, `test-standards.md`, `architecture.md`, `automation-standard.md` |
| 8 | Test Execution Agent | `.github/sub-agents/automation/08-api-test-executor.md` | 2.3.2 | Active | Execute tests, perform dry-run discovery, run targeted specs, generate structured execution findings, and support Allure reporting flow | `routing-policy.md`, `output-behavior.md`, `coding-standards.md`, `test-standards.md` |
| 9 | Failure Analysis Agent | `.github/sub-agents/automation/09-api-test-debugger.md` | 3.0.1 | Active | Analyze failed tests, classify failures, identify immediate failure cause, separate app defects from test/framework/environment issues, and propose approved fixes | `architecture.md`, `coding-standards.md`, `test-standards.md` |

### 4.4 Governance Agents

| # | Agent | File | Version | Status | Responsibility | Dependencies |
|---|---|---|---|---|---|---|
| 10 | Playwright API Automation Code Reviewer | `.github/sub-agents/governance/10-playwright-api-automation-code-reviewer.md` | 2.7.1 | Active | Review code quality, framework architecture, maintainability, naming, folder ownership, thin-spec rules, service/assertion boundaries, and technical debt | `architecture.md`, `coding-standards.md`, `test-standards.md` |
| 11 | Test Coverage Analyzer | `.github/sub-agents/governance/11-api-test-coverage-analyzer.md` | 2.4.1 | Active | Analyze test coverage, traceability, missing scenarios, orphan tests, duplicate tests, RBAC gaps, security gaps, and coverage readiness | `architecture.md`, `test-standards.md`, `dependency-registry.json`, `security-validation-registry.json` |
| 12 | API Compliance Reviewer | `.github/sub-agents/governance/12-api-compliance-reviewer.md` | 1.2.1 | Active | Own REST/status governance, Swagger/runtime mismatch classification, enterprise expected behavior, defect classification, and API quality scoring | `test-standards.md`, `functional-validation-registry.json`, `dependency-registry.json`, `coding-standards.md` |

### 4.5 Proposed Operations Agents

| # | Agent | File | Version | Status | Responsibility | Dependencies |
|---|---|---|---|---|---|---|
| 13 | Root Cause Analyzer | `.github/sub-agents/operations/13-root-cause-analyzer.md` | 1.0.0 | Proposed | Perform deeper systemic root-cause analysis after failure triage and produce remediation options with confidence and blast-radius notes | `architecture.md`, `test-standards.md`, `coding-standards.md` |

### 4.6 Domain Entry-Point Files

| # | File | Version | Status | Purpose |
|---|---|---|---|---|
| 14 | `.github/sub-agents/discovery/README.md` | 1.0.0 | Active | Discovery domain entry point listing canonical discovery sub-agents |
| 15 | `.github/sub-agents/design/README.md` | 1.0.0 | Active | Design domain entry point listing canonical design sub-agents |
| 16 | `.github/sub-agents/automation/README.md` | 1.0.0 | Active | Automation domain entry point listing canonical automation sub-agents |
| 17 | `.github/sub-agents/governance/README.md` | 1.0.0 | Active | Governance domain entry point listing canonical governance sub-agents |
| 18 | `.github/sub-agents/operations/README.md` | 1.0.0 | Active | Operations domain entry point listing canonical operations sub-agents |

---

## 5. Agent Ownership Matrix

| Capability | Owning Agent | Supporting Source |
|------------|--------------|------------------|
| Main orchestration | Master Agent | `routing-policy.md`, `agent-manifest.md` |
| Menu navigation | Routing configuration | `routing-policy.md` |
| Output formatting | Output behavior configuration | `output-behavior.md` |
| Swagger endpoint discovery | OpenAPI Contract Analyzer | Swagger/OpenAPI |
| Module order preservation | OpenAPI Contract Analyzer | Swagger tags order |
| Contract source selection | Contract Source Selector | `routing-policy.md` |
| Manual request/response intake | Contract Source Selector | `test-standards.md` |
| Contract resolution | OpenAPI Contract Analyzer | Swagger, registries, standards |
| Requirement analysis | Requirements Analysis Agent | Contract handoff, AC, story details |
| Business clarification | Requirements Analysis Agent | User input |
| Functional test-case design | Test Design Agent | Analysis handoff, test standards |
| Security test-case design | Test Design Agent | SASP standards, security registry |
| Test-case review | Test Case Reviewer | Generated test cases |
| Script generation | Automation Script Generation Agent | Test cases, architecture, coding standards |
| Script review | Automation Script Review Agent | Generated specs, matrices, test cases |
| Test execution | Test Execution Agent | Playwright project |
| Failure analysis | Failure Analysis Agent | Execution results |
| Root cause analysis | Root Cause Analyzer | Failure triage handoff + execution evidence |
| Code quality review | Code Reviewer | Coding standards, architecture |
| REST/status compliance | REST Compliance Reviewer | Test standards, runtime evidence, Swagger |
| Coverage analysis | Coverage Intelligence Agent | Specs, test cases, matrices |

---

## 6. Knowledge Files

Knowledge files are reference sources only. They provide standards and project facts but do not behave as autonomous agents.

| # | Name | File | Version | Status | Purpose |
|---|---|---|---|---|---|
| 1 | Architecture | `.github/knowledge/architecture/architecture.md` | 2.2.1 | Active | Project structure, framework architecture, dependency hierarchy, folder ownership, setup and cleanup strategy |
| 2 | Coding Standards | `.github/knowledge/standards/coding-standards.md` | 3.0.2 | Active | TypeScript, Playwright, service, assertion, payload, matrix, helper, reporter, and naming standards |
| 3 | Test Standards | `.github/knowledge/standards/test-standards.md` | 2.5.0 | Active | Functional coverage, negative coverage, RBAC coverage, SASP security coverage, status semantics, POST intent resolution, test-case format |
| 4 | Role Model | `.github/knowledge/architecture/role-model.md` | 1.0.0 | Active | Canonical REITSuite roles, abbreviations, categories, enum constants, and default denied-role status mapping |
| 5 | API Dependency Registry | `.github/knowledge/registries/dependency-registry.json` | 1.1.0 | Active | Entity dependencies, required IDs, setup/cleanup APIs, builders, fixture and setup strategy |
| 6 | API Endpoint Registry | `.github/knowledge/registries/endpoint-registry.json` | 1.1.0 | Active | Endpoint catalog and endpoint-to-dependency impact mapping |
| 7 | Validation Registry | `.github/knowledge/registries/functional-validation-registry.json` | 1.1.0 | Active | Validation taxonomy, input constraints, method-level validation behavior |
| 8 | Security Validation Registry | `.github/knowledge/registries/security-validation-registry.json` | 1.0.0 | Active | SASP applicability, attack category rules, input-vector mapping, security classification |
| 9 | Business Rules Registry | `.github/knowledge/registries/business-rules-registry.json` | 1.1.0 | Active | Business-rule overrides and endpoint-level expected status decisions |
| 10 | Status Code Policy Registry | `.github/knowledge/registries/status-code-policy-registry.json` | 1.2.0 | Active | Method and error status defaults, tie-breaker rules, and status evidence policy |
| 11 | UI Used Endpoint Catalog | `.github/knowledge/registries/ui-used-endpoints-analysis.json` | 1.1.0 | Active | UI-observed request payload/response usage catalog per endpoint. Status codes are evidence-only and never expectation authority |
| 12 | Stage Handoff Artifacts | `.github/knowledge/handoffs/*.json` | 1.0.0 | Active | Canonical stage-transition handoff payloads used to reduce context loss between domains |

### Rules

- Agents must read required knowledge files at time of use.
- Knowledge files must not define menus.
- Knowledge files must not define user-visible output behavior.
- Knowledge files must not override master governance, routing, or output behavior.
- Registry JSON files take priority over prose documents for endpoint-specific metadata.

---

## 7. Configuration Files

| # | Name | File | Version | Status | Purpose |
|---|---|---|---|---|---|
| 1 | Routing | `.github/governance/routing-policy.md` | 2.10.0 | Active | Single source of truth for menus, navigation, canonical navigation vocabulary, quick commands, summary command, sub-menus, workflow routing, and back behavior |
| 2 | Output Behavior | `.github/config/output-behavior.md` | 2.4.0 | Active | Single source of truth for user-visible formatting, silent processing, no-preamble behavior, context summary card, stage progress tracker, canonical element order, outcome status lines, emoji glossary and accessibility, menu rendering contracts, and response structure |
| 3 | Agent Manifest | `.github/governance/agent-manifest.md` | 3.8.2 | Active | Canonical registry for agent names, paths, versions, status, dependencies, and ownership boundaries |
| 4 | Enforcement Rules | `.github/config/enforcement-rules.md` | 1.2.0 | Active | Non-negotiable rule card re-asserted at every stage boundary; owns layering, gates, status authority, question ownership, reuse evidence, handoff provenance, security assertions, output context card and progress tracker, accessibility, navigation, Markdown-only, and ownership exclusions |
| 5 | Runtime Profile (embedded) | `.github/governance/operating-model.md` § Verified Project Profile | 1.1.1 | Active | Verified repository facts: runtime, framework, tooling, shared test data, and quality gates |

### Rules

- `routing-policy.md` owns menus and navigation.
- `output-behavior.md` owns response formatting.
- `enforcement-rules.md` owns the non-negotiable rules; other files link to it and must not restate them.
- `agent-manifest.md` owns registry metadata only.
- Configuration files must not contain generated test logic.
- Configuration files must not contain endpoint-specific test cases.

---

## 8. Schema Files

| # | Name | File | Version | Status | Purpose |
|---|---|---|---|---|---|
| 1 | Dependency Registry Schema | `.github/knowledge/schemas/dependency-registry.schema.json` | 1.0.0 | Active | Validate dependency-registry entries and required setup/cleanup mapping fields |
| 2 | Endpoint Registry Schema | `.github/knowledge/schemas/endpoint-registry.schema.json` | 1.0.0 | Active | Validate endpoint-registry entries and endpoint-to-dependency mapping structure |
| 3 | Functional Validation Registry Schema | `.github/knowledge/schemas/functional-validation-registry.schema.json` | 1.0.0 | Active | Validate functional validation taxonomy and method-level constraints |
| 4 | Security Validation Registry Schema | `.github/knowledge/schemas/security-validation-registry.schema.json` | 1.0.0 | Active | Validate security validation registry entries |
| 5 | Business Rules Registry Schema | `.github/knowledge/schemas/business-rules-registry.schema.json` | 1.0.0 | Active | Validate business-rules registry structure and endpoint override entries |
| 6 | Status Code Policy Registry Schema | `.github/knowledge/schemas/status-code-policy-registry.schema.json` | 1.0.0 | Active | Validate status-code authority matrix and policy metadata |
| 7 | UI Used Endpoints Analysis Schema | `.github/knowledge/schemas/ui-used-endpoints-analysis.schema.json` | 1.0.0 | Active | Validate UI-used endpoint analysis evidence catalog structure |
| 8 | Stage Handoff Template Schema | `.github/knowledge/schemas/stage-handoff-template.schema.json` | 1.0.0 | Active | Validate stage-level handoff templates used for producer/consumer contracts |
| 9 | Handoff Schema | `.github/knowledge/schemas/handoff.schema.json` | 1.0.0 | Active | Validate stage-transition template handoffs and unified analysis/contract/test-case handoff payloads |

### Rules

- Schemas define structure only.
- Schemas must not define workflow behavior.
- Schemas must not define menu behavior.
- Handoff-producing agents must follow the handoff schema where applicable.

---
## 9. Required Handoff Ownership

| Handoff | Producer | Consumer |
|----------|----------|----------|
| `CONTRACT_SOURCE_HANDOFF` | Contract Source Selector | OpenAPI Contract Analyzer, Requirements Analysis Agent |
| `CONTRACT_RESOLVED_HANDOFF` | OpenAPI Contract Analyzer | Requirements Analysis Agent, Test Design Agent, REST Compliance Reviewer |
| `ANALYSIS_HANDOFF` | Requirements Analysis Agent | Test Design Agent, Test Case Reviewer |
| `TEST_CASE_HANDOFF` | Test Design Agent | Test Case Reviewer, Automation Script Generation Agent |
| `TEST_CASE_REVIEW_HANDOFF` | Test Case Reviewer | Automation Script Generation Agent |
| `SCRIPT_GENERATION_HANDOFF` | Automation Script Generation Agent | Automation Script Reviewer, Code Reviewer, Test Execution Agent |
| `SCRIPT_REVIEW_HANDOFF` | Automation Script Reviewer Agent | Code Reviewer, Test Execution Agent |
| `CODE_REVIEW_HANDOFF` | Code Reviewer Agent | Test Execution Agent, Failure Analysis Agent |
| `EXECUTION_HANDOFF` | Test Execution Agent | Failure Analysis Agent, REST Compliance Reviewer, Coverage Analyzer |
| `FAILURE_ANALYSIS_HANDOFF` | Failure Analysis Agent | REST Compliance Reviewer, Coverage Analyzer |
| `ROOT_CAUSE_HANDOFF` | Root Cause Analyzer Agent | Failure Analysis Agent, Test Execution |
| `REST_COMPLIANCE_HANDOFF` | REST Compliance Reviewer Agent | Coverage Analyzer, Master |
| `COVERAGE_HANDOFF` | Coverage Analyzer Agent | Master |

### Rules

- Downstream agents must not ask for information that exists in the upstream handoff.
- If a required handoff is missing, route to the owning agent.
- If a handoff is stale because files changed, regenerate or revalidate it.
- Handoff data must be treated as session context until endpoint or scope changes.

---

## 10. Deterministic Routing Boundaries

| User Intent | Primary Owner |
|-------------|---------------|
| Start or menu | Routing |
| Select API type | Routing |
| Select endpoint from Swagger | OpenAPI Contract Analyzer |
| Provide manual request/response | Contract Source Selector |
| Ask for test-case design | Requirements Analysis Agent, then Test Design Agent |
| Ask for test-case review | Test Case Reviewer |
| Ask for automation generation | Automation Script Generation Agent |
| Ask for script review | Automation Script Review Agent |
| Ask to run tests | Test Execution Agent |
| Ask to debug failed tests | Failure Analysis Agent |
| Ask for root cause analysis | Root Cause Analyzer |
| Ask for code review | Code Reviewer |
| Ask for REST/status review | REST Compliance Reviewer |
| Ask for coverage | Coverage Intelligence Agent |
| Ask for architecture or standards | Relevant knowledge file through Master Agent |
| Ask for final copy-paste code | Relevant owning generation or standards agent |

### Rules

- If the user intent maps to one owner, delegate to that owner.
- If multiple owners are involved, follow the lifecycle order from the master agent and `routing-policy.md`.
- Do not allow downstream agents to override upstream ownership.
- Do not allow generic answers when a specialized agent exists.

---

## 11. Active Agent Loading Policy

When an operation requires a sub-agent:

1. Load the owning agent.
2. Load only its required dependencies.
3. Load required knowledge files fresh.
4. Do not show file loading details to the user.
5. Do not expose internal routing decisions.
6. Produce only the user-facing result defined by `output-behavior.md`.

### Rules

- Do not load every agent for every request.
- Do not use stale dependency content after file modification.
- Do not ask the user which sub-agent to use.
- The manifest determines agent identity and path only, not runtime output wording.

---

## 12. Enterprise Consistency Rules

To keep the custom agent stable:

### 12.1 Document Structure Standard (MANDATORY)

Every `.github` Markdown file follows this skeleton. Reviewers verify it during change review using the checklist in §14.

| Element | Rule |
|----------|------|
| Front matter | Required. Knowledge/config files carry `title`, `version`, `lastReviewed`, `owner`, `standard`, `status`, `type`, `ssofFor`. Agent files carry `name`, `description`, `version`, `owner`. |
| H1 | Exactly one per file, immediately after the front matter, matching the agent name or document title. |
| H2 | Numbered top-level sections for orchestration and registry files; named sections for agents and knowledge files. |
| Heading depth | Maximum H4. Deeper nesting means the file should be split. |
| Body metadata | **PROHIBITED.** `## Agent Metadata`, `## Agent Name`, `## Version`, and `> Version:` blockquote headers duplicate front matter and MUST NOT exist. |
| Version | Declared in exactly two places: the file's front matter and its row in this manifest. They must match. |
| Raw HTML | Prohibited outside code spans. |
| Cross-references | Cite the owning file and its section (for example, `coding-standards.md §2.12.1`). Never restate the rule. |

### 12.2 Consistency Rules

| Area | Rule |
|--------|------|
| File headers | Every `.github` Markdown file MUST open with YAML front matter carrying `title`, `version`, `lastReviewed`, `owner`, `standard`, `status`, `type`, and `ssofFor` (agent files use `name` / `description` instead of `title` / `ssofFor`). Blockquote or HTML-comment headers are prohibited. |
| Agent names | Must match this manifest exactly |
| File paths | Must match this manifest exactly |
| Versions | Must be updated here when the file changes |
| Responsibilities | Must remain non-overlapping |
| Dependencies | Must be explicit |
| Deprecated files | Must be documented |
| Ownership | Must not be duplicated across unrelated files |
| Routing | Must remain in `routing-policy.md` |
| Output behavior | Must remain in `output-behavior.md` |
| Standards | Must remain in knowledge files |

---

## 13. Deprecated Agents

| # | Agent | File | Superseded By | Status | Notes |
|---|---|---|---|---|---|
| 1 | None | None | None | None | No deprecated agents in this version |

### Rules

- Do not delete historical entries without review.
- If an agent is renamed, mark the old name as deprecated.
- If an agent responsibility is absorbed by another agent, record the replacement agent.
- If a deprecated agent file remains in the repository, mark it as deprecated in the file header.

---

## 14. Validation Checklist

Before accepting changes to this manifest, verify:

| Check | Required Result |
|---------|----------------|
| Every file opens with valid YAML front matter | Yes |
| Every file has exactly one H1 | Yes |
| No file restates its version in the body | Yes |
| Front-matter version matches this manifest's row | Yes |
| Every sub-agent has Breadcrumb + Response header | Yes |
| Every active agent has a unique responsibility | Yes |
| Every active agent has a valid path | Yes |
| No two agents own the same primary decision area | Yes |
| Routing behavior is not duplicated here | Yes |
| Output behavior is not duplicated here | Yes |
| Knowledge files are listed as reference only | Yes |
| Deprecated agents are documented | Yes |
| Version numbers are updated | Yes |
| Dependencies are explicit | Yes |
| Master agent version matches the primary agent entry | Yes |

---
## 15. Version History

| Version | Date | Changes |
|----------|------------|----------|
| 3.8.2 | 2026-09-14 | Clarified `operating-model.md` authority wording to separate governance authority/profile from arbitration ownership; updated Runtime Profile embedded version to `1.1.1`; and synchronized internal manifest self-version references. |
| 3.8.1 | 2026-09-14 | Consistency hardening pass: aligned primary-agent version to `7.1.0`; synchronized routing configuration version to `2.10.0`; updated operational section naming to keep proposed operations explicitly non-active; and synchronized internal manifest self-version references to eliminate registry drift. |
| 3.7.0 | 2026-09-11 | Consolidated `.github/runtime/project-profile.md` into `operating-model.md` under **Verified Project Profile**; updated canonical references in copilot instructions and master-agent SSoT mapping; removed standalone runtime profile file to reduce governance file count. |
| 3.6.0 | 2026-09-10 | Markdown structure and SSoT hardening: removed `## Agent Metadata` / `## Agent Name` / `## Version` body sections and blockquote version headers from all 12 sub-agents (they duplicated front matter and had already drifted in 4 agents); added the missing H1 to 5 files; repointed 6 stale master-agent §9 cross-references to `coding-standards.md §2.12.1`; completed front matter on `enterprise-api-automation-standard.md`; added the Document Structure Standard (§12.1) and its review checklist; wired the Current Context card and Workflow Summary tracker into all 12 sub-agents via Response Header directive naming each agent's active stage and defined the six canonical activity-mode stage rows. |
| 3.5.0 | 2026-09-10 | Added the always-on Workflow Summary stage tracker (`✅ COMPLETE`, `⏳ IN PROGRESS`, `⬜ PENDING`, `⏭ SKIPPED`, `❌ FAILED`, exactly one active stage, forward-only transitions) and the canonical response element order to `output-behavior.md`; registered the tracker in the emoji glossary and bound the tracker to the rule card and master validation. |
| 3.4.0 | 2026-09-10 | Added the Current Context summary card and outcome-based status lines (countable results instead of activity narration) to `output-behavior.md`; defined the previously undeclared Summary workflow-summary command in `routing-policy.md` §4.2 and registered it as a quick command; bound both to the rule card and master validation. |
| 3.3.0 | 2026-09-10 | Standardized all `.github` Markdown files on YAML front matter (`title`, `version`, `lastReviewed`, `owner`, `standard`, `status`, `type`, `ssofFor`), replacing blockquote and HTML-comment headers; added front-matter consistency rule and validation check; formatted the Markdown corpus with Prettier and extended `format:check` to cover `.github/**/*.md`. |
| 3.2.0 | 2026-09-10 | Restructured master agent to `7.0.0` using the 12-section enterprise model (Purpose, Scope, Priority Order, SSoT Model, Routing Model, Workflow Model, Approval Model, Context Model, Delegation Model, Governance, Validation, Glossary); extracted the verified project profile to `project-profile.md` and the role model to `role-model.md`; relocated layer responsibilities, security-assertion detail, coverage ownership, and language/tone to their owning SSoT files. |
| 3.1.0 | 2026-09-10 | Production-readiness remediation: added `enforcement-rules.md` non-negotiable rule card; master agent 6.2.0 delegates reuse-first, status authority, navigation, and progress standards to SSoT and bounds knowledge re-reads to rule-card re-assertion; standardized navigation vocabulary (`Go Back`, `Home`, `Cancel`, `Search`, `Summary`, `Exit`) across all menus and removed numbering gaps; anchored narration detection and accessible status rendering to `output-behavior.md`; deterministic POST intent resolution in `test-standards.md`; handoff provenance, `statusResolution`, and `reuseEvidence` in `handoff.schema.json`; handoff acceptance gate and auditable reuse-first evidence in the Script Generation Agent; reuse-evidence and provenance CRITICAL rules in the Code Reviewer; replaced keycap emoji numbering with plain numbering across all menus. |
| 3.0.2 | 2026-08-28 | Added status-aware response-schema governance and aligned generator, reviewer, debugger, and coding-standard versions. |
| 3.0.0 | 2026-08-17 | Converted manifest into strict enterprise registry only, clarified single-source-of-truth boundaries, added ownership matrix, handoff ownership, deterministic routing boundaries, and validation checklist. |
| 2.20.0 | 2026-08-13 | Aligned custom-agent stack to enterprise file responsibility model: specs orchestrate assertions, services call APIs only, and assertion modules own response validation and diagnostics. |
| 2.19.0 | 2026-08-11 | Updated master agent version after consolidating user-visible output behavior under output-behavior authority. |

---