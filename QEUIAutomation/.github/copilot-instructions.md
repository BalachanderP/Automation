# Copilot instructions for this repository

## Project overview
- This repo contains a Playwright + TypeScript automation suite for web application testing.
- Tests live in `tests/` and should follow the project’s existing page object model pattern.
- Reusable page objects belong in `src/page/`, shared utilities in `src/utils/`, and test lifecycle hooks in `src/framework/lifeCycle/`.


## Coding conventions

see [instructions/automation-instructions.md](./instructions/automation-instructions.md) for coding conventions and test structure guidance.

<!-- see [Playwright Test documentation](https://playwright.dev/docs/writing-tests) for guidance on writing tests, assertions, and using fixtures. -->


## Test structure guidance
- Add new end-to-end scenarios under `tests/` using the same style as the existing specs.
- If a workflow is repeated across tests, encapsulate it in a page object instead of duplicating logic.
- Keep assertions focused on the behavior under test and use `expect(...).toBe(...)`, `toHaveText()`, `toContainText()`, and similar Playwright assertions rather than custom checks.
- Use `await` consistently and avoid mixing async patterns or unnecessary waits.

## Quality bar for changes
- Preserve the current project architecture and naming conventions.
- Do not add broad, unrelated refactors during a focused change.
- Prefer surgical updates that fit the existing structure of the repo.
- Do not leave `test.only` in code.
- Do not use `console.log()` for debugging; use the Playwright trace viewer or Allure reports for debugging instead.
- Do not use 'test.skip' to bypass failing tests; instead, fix the underlying issue or create a new issue for follow-up.
- Validate changes with the smallest relevant test command, usually a targeted Playwright spec or related subset.

## Locator strategy
- Prefer role-based locators (`getByRole`) and accessible selectors where possible.
- Reuse existing locators from page objects before introducing new ones.
- Avoid brittle selectors based on dynamic CSS classes, indexes, or generated IDs.
- Use Playwright-recommended locator patterns instead of XPath unless no alternative exists.

## Page object guidelines
- Keep assertions in test files whenever practical; page objects should primarily contain actions and element accessors.
- Encapsulate reusable workflows inside page objects.
- Do not expose implementation details of page locators to tests.
- Keep page object methods small and focused on a single business action.

## Test data
- Reuse existing test data builders, fixtures, and utilities before creating new data sources.
- Avoid hardcoding environment-specific values.
- Generate unique test data when required to prevent test collisions.
- Store reusable test data in the established project location.

## Code review expectations
- Remove unused imports, variables, and helper methods.
- Keep PR changes focused on the requested task.
- Follow existing naming conventions before introducing new patterns.
- Ensure new code passes linting and TypeScript validation.

## Code review expectations
- Remove unused imports, variables, and helper methods.
- Keep PR changes focused on the requested task.
- Follow existing naming conventions before introducing new patterns.
- Ensure new code passes linting and TypeScript validation.

## When updating existing code
- Read the surrounding implementation before making changes.
- Follow the patterns used in adjacent files.
- Extend existing page objects and utilities instead of creating duplicates.
- Preserve backwards compatibility unless the task explicitly requires breaking changes.

## Repository-specific notes
- Playwright configuration is in `playwright.config.ts` and includes global setup/teardown hooks.
- Browser automation should remain compatible with the existing Chromium-based setup unless the task explicitly requires broader coverage.
- Keep reporting and artifacts aligned with the repo’s current Allure/HTML reporting setup.

## When creating or editing code
- Check the related page object and utility before adding a new implementation to avoid duplication.
- Follow the repo’s TypeScript conventions and keep types explicit where useful.
- Prefer small, focused helper methods over large imperative blocks in tests.
- If a new utility is needed, place it in the appropriate `src/utils/` area and keep it reusable.
