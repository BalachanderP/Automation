import { test, expect } from '@playwright/test';
import openai, { OpenAI } from "openai";

const client = new OpenAI({apiKey:"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"});


test('@smoke - Sign In Application', async ({ page }) => {
    await page.goto("https://demo.automationtesting.in");

    await page.locator('#btn1').click();

    await page.getByPlaceholder('E mail').fill('balachander_india@yahoo.com');
    await page.getByPlaceholder('Password').fill('Welcome12345');
    await page.locator('#enterbtn').click();

    const errorMessage = await page.locator('#errormsg').innerText();
    expect(errorMessage).toBe('Invalid User Name or PassWord');
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


