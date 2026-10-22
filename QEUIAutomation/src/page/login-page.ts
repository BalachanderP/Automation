import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[placeholder="E mail"]');
    this.passwordInput = page.locator('input[placeholder="Password"]');
    this.signInButton = page.locator('#btn1');
    this.loginButton = page.locator('#enterbtn');
    this.errorMessage = page.locator('#errormsg');
  }

  async open(baseUrl: string): Promise<void> {
    await this.navigate(baseUrl);
  }

  async signIn(username: string, password: string): Promise<void> {
    await this.helper.click(this.signInButton);
    await this.helper.fill(this.usernameInput, username);
    await this.helper.fill(this.passwordInput, password);
    await this.helper.click(this.loginButton);
  }

  async getErrorMessage(): Promise<string | null> {
    await this.helper.waitForVisible(this.errorMessage,5000);
    const message = await this.helper.getText(this.errorMessage);
    return message ? message.trim() : null;
  }
}
