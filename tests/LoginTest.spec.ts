import { test, expect } from '@playwright/test';
import openai, { OpenAI } from "openai";

const client = new OpenAI({apiKey:"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"});


test('@smoke - Sign In Application', async ({ page }) => {
  // Read environment variables with fallback values
  const baseUrl = process.env.BASE_URL || 'https://demo.automationtesting.in';
  const username = process.env.USERNAME || 'balachander_india@yahoo.com';
  const password = process.env.PASSWORD || 'Welcome12345';
  const expectedError = process.env.EXPECTED_ERROR || 'Invalid User Name or PassWord';

  console.log(`Testing URL: ${baseUrl}`);
  console.log(`Using username: ${username}`);

  // Navigate to the application
  await page.goto(baseUrl);

  // Click sign in button with better selector and waiting
  const signInButton = page.locator('#btn1');
  await expect(signInButton).toBeVisible();
  await signInButton.click();

  // Wait for login form to appear
  await page.waitForURL(/Register.html/); // Wait for URL change
  await expect(page.getByPlaceholder('E mail')).toBeVisible();

  // Fill login form
  await page.getByPlaceholder('E mail').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  
  // Click login button
  await page.locator('#enterbtn').click();

  // Wait for error message to appear with timeout
  const errorMessageLocator = page.locator('#errormsg');
  await expect(errorMessageLocator).toBeVisible({ timeout: 5000 });
  
  // Get and validate error message
  const errorMessage = await errorMessageLocator.innerText();
  expect(errorMessage).toBe(expectedError);

  // Optional: Take screenshot for evidence
  await page.screenshot({ path: 'test-results/smoke-login-error.png', fullPage: true });
});

test('@Regression - Fill the details into the application', async ({ page }) => {

    await page.goto('https://demo.automationtesting.in');

    await page.locator('#email').fill('balachander_india@yahoo.com');

    await Promise.all([
        page.waitForNavigation(),  // Wait for navigation triggered by click
        page.locator('#enterimg').click(),
    ]);

    const pageTitle = await page.title();
    expect(pageTitle).toBe("Register");


    await page.getByPlaceholder('First Name').fill('Bala');
    await page.getByPlaceholder('Last Name').fill('chander');

    await page.locator('[ng-model="Adress"]').fill('123 Main Street');
    await page.locator('[ng-model="EmailAdress"]').fill('balachander_india@yahoo.com');

    await page.locator('[ng-model="Phone"]').fill('9994294462');

    await page.locator('[name="radiooptions"]').first().check();

    await page.locator('input[type="checkbox"][value="Cricket"]').check();
    await page.locator('input[type="checkbox"][value="Movies"]').check();
    
});


