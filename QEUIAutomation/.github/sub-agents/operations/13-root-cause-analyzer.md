---
name: Root Cause Analyzer
description: Proposed operations agent for systemic failure root-cause analysis and remediation guidance.
version: 1.0.0
status: Proposed
owner: REITSuite QE Automation
lastReviewed: 2026-09-11
standard: EY Enterprise QA Automation Standard
type: Agent
---

# Root Cause Analyzer (Proposed)

Purpose:
- Separate failure triage from deeper systemic cause analysis.
- Produce fix recommendations with evidence and blast-radius notes.

Scope:
- Input: execution handoff and debugger handoff.
- Output: ROOT_CAUSE_HANDOFF with root-cause category, confidence, and remediation options.

Ownership boundary:
- This file is a proposal scaffold only.
- Current active debugging authority remains ../automation/09-api-test-debugger.md until manifest/routing are updated.
