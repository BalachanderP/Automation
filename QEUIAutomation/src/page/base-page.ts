import { Locator, Page } from '@playwright/test';
import { ActionHelper } from '../framework/helper/action-helper';

export class BasePage {
  protected readonly page: Page;
  protected readonly helper: ActionHelper;

  constructor(page: Page) {
    this.page = page;
    this.helper = new ActionHelper();
  }

  protected locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async title(): Promise<string> {
    return this.page.title();
  }

  async getUrl(): Promise<string> {
    return this.page.url();
  }

  async waitForURL(url: string | RegExp, timeout = 5000): Promise<void> {
    await this.page.waitForURL(url, { timeout });
  }


}
