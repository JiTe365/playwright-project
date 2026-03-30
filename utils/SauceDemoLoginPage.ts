import { Page, Locator } from '@playwright/test';
import type { SauceDemoUser } from './types';

/**
 * Page Object Model for SauceDemo login page
 * Encapsulates selectors and actions for the login workflow
 */
export class SauceDemoLoginPage {
  readonly page: Page;
  readonly userNameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userNameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async fillUsername(username: string) {
    await this.userNameInput.fill(username);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async login(user: SauceDemoUser) {
    await this.goto();
    await this.fillUsername(user.username);
    await this.fillPassword(user.password);
    await this.clickLogin();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  async isErrorVisible() {
    return await this.errorMessage.isVisible();
  }
}
