import { FullConfig } from '@playwright/test';

async function globalSetup(_config: FullConfig) {
  console.log('[global-setup] Starting Playwright suite');
  process.env.PLAYWRIGHT_GLOBAL_SETUP = 'completed';
}

export default globalSetup;
