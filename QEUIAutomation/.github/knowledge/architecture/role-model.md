---
title: REITSuite Role Model
version: 1.0.0
lastReviewed: 2026-09-10
owner: REITSuite QE Automation
standard: EY Enterprise QA Automation Standard
status: Active
type: Knowledge
ssotFor: REITSuite roles, abbreviations, categories, denied-role status mapping
---

# REITSuite Role Model

Role-based validation MUST cover all five REITSuite roles for every non-public endpoint.

| Role | Abbreviation | Category | Enum constant |
| :--- | :--- | :--- | :--- |
| System Administrator | SA | Internal | `UserRoles.SYSTEM_ADMINISTRATOR` |
| Engagement Administrator | EA | Internal | `UserRoles.ENGAGEMENT_ADMINISTRATOR` |
| Engagement User | EU | Internal | `UserRoles.ENGAGEMENT_USER` |
| External Checklist User | XR | External | `UserRoles.EXTERNAL_CHECKLIST_USER` |
| External Temp User | XT | External | `UserRoles.EXTERNAL_TEMP_USER` |

## Denied-Role Status Mapping

Applies unless the contract explicitly overrides it:

| Denial case | Expected status |
| :--- | :--- |
| Authenticated denied internal/external role (SA, EA, EU, XR) | `403 Forbidden` |
| External Temp User (XT) denial | `401 Unauthorized` |

Authentication failures (`401`) and authorization failures (`403`) are distinct classes and must never be merged in a matrix, test case, or assertion.

## Boundaries

- Matrix keys, enum usage, and role name formatting in generated code are owned by [`coding-standards.md`](../standards/coding-standards.md).
- XT functional-spec isolation rules are owned by [`coding-standards.md`](../standards/coding-standards.md) §2.10-A.
- Per-endpoint role applicability and status expectations are owned by [`test-standards.md`](../standards/test-standards.md).

This file owns only the canonical role list, abbreviations, categories, and the default denied-role status mapping. Do not restate it elsewhere.