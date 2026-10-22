import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/page/login-page';
import { RegistrationPage } from '../src/page/registration-page';
import { getEnvValue, loadEnvFile } from '../src/utils/env';
import { Tag } from '../src/utils/tag.enum';

loadEnvFile();

const baseUrl = getEnvValue(['BASE_URL', 'URL']);
const username = getEnvValue(['USERNAME', 'USER_NAME', 'USER']);
const password = getEnvValue(['PASSWORD', 'PASS']);
const expectedError = getEnvValue(['EXPECTED_ERROR', 'ERROR']).trim();

test('Sign In Application with Page Object', { tag: Tag.smoke }, async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open(baseUrl);
  await loginPage.signIn(username, password);

  const errorMessage = await loginPage.getErrorMessage();
  expect(errorMessage?.trim()).toBe(expectedError);
});


test('Fill the details into the application', { tag: Tag.smoke }, async ({ page }) => {
  const registrationPage = new RegistrationPage(page);

  await registrationPage.openThroughHome(baseUrl, 'balachander_india@yahoo.com');
  await registrationPage.expectTitle('Register');

  await registrationPage.fillRegistration({
    firstName: 'Bala',
    lastName: 'chander',
    address: '123 Main Street',
    email: 'balachander_india@yahoo.com',
    phone: '9994294462',
    genderIndex: 0,
    hobbies: ['Cricket', 'Movies'],
  });
});


