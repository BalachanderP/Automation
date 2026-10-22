import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './base-page';

export interface RegistrationData {
  firstName: string;
  lastName: string;
  address?: string;
  email?: string;
  phone?: string;
  genderIndex?: number; // 0-based index for gender radios
  hobbies?: string[]; // values like 'Cricket', 'Movies'
}

export class RegistrationPage extends BasePage {
  private readonly emailOnHome: Locator;
  private readonly enterButton: Locator;
  private readonly firstName: Locator;
  private readonly lastName: Locator;
  private readonly address: Locator;
  private readonly email: Locator;
  private readonly phone: Locator;
  private readonly genderRadios: Locator;

  constructor(page: Page) {
    super(page);
    this.emailOnHome = page.locator('#email');
    this.enterButton = page.locator('#enterimg');

    this.firstName = page.getByPlaceholder('First Name');
    this.lastName = page.getByPlaceholder('Last Name');
    this.address = page.locator('[ng-model="Adress"]');
    this.email = page.locator('[ng-model="EmailAdress"]');
    this.phone = page.locator('[ng-model="Phone"]');
    this.genderRadios = page.locator('[name="radiooptions"]');
  }

  async openThroughHome(baseUrl: string, emailValue: string): Promise<void> {
    await this.navigate(baseUrl);
    await this.helper.fill(this.emailOnHome, emailValue);
    await Promise.all([
      this.page.waitForNavigation(),
      this.helper.click(this.enterButton),
    ]);
  }

  async expectTitle(expected: string): Promise<void> {
    const title = await this.title();
    expect(title).toBe(expected);
  }

  async fillName(first: string, last: string): Promise<void> {
    await this.helper.fill(this.firstName, first);
    await this.helper.fill(this.lastName, last);
  }

  async fillContact(address?: string, email?: string, phone?: string): Promise<void> {
    if (address) await this.helper.fill(this.address, address);
    if (email) await this.helper.fill(this.email, email);
    if (phone) await this.helper.fill(this.phone, phone);
  }

  async selectGender(index = 0): Promise<void> {
    const radio = this.genderRadios.nth(index);
    await radio.check();
  }

  async selectHobbies(hobbies: string[]): Promise<void> {
    for (const hobby of hobbies) {
      const locator = this.page.locator(`input[type="checkbox"][value="${hobby}"]`);
      await locator.check();
    }
  }

  async fillRegistration(data: RegistrationData): Promise<void> {
    await this.fillName(data.firstName, data.lastName);
    await this.fillContact(data.address, data.email, data.phone);
    if (typeof data.genderIndex !== 'undefined') await this.selectGender(data.genderIndex);
    if (data.hobbies && data.hobbies.length) await this.selectHobbies(data.hobbies);
  }
}
