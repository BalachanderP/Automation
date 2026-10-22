




## Coding conventions
- Keep test code readable, deterministic, and explicit.
- Prefer existing helpers, enums, and page objects before creating new abstractions.
- Use the existing Playwright patterns with `test`, `expect`, and `page` fixtures.
- Do not hardcode credentials, URLs, or environment-specific values in tests.
- Read configuration from environment variables through the existing `loadEnvFile()` and `getEnvValue()` utilities when possible.
- Use stable locators and avoid flaky selectors whenever possible.
- Keep test names descriptive and aligned with the user workflow being validated.
