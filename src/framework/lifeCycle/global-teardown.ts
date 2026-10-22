import { FullConfig } from '@playwright/test';

async function globalTeardown(_config: FullConfig) {
  console.log('[global-teardown] Cleaning up Playwright suite');
  delete process.env.PLAYWRIGHT_GLOBAL_SETUP;
}

export default globalTeardown;
