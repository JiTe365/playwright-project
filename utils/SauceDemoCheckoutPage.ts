import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for SauceDemo checkout pages
 * Handles checkout step one (shipping info) and step two (order review)
 */
export class SauceDemoCheckoutPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;
  readonly itemTotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly orderComplete: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('#continue');
    this.finishButton = page.locator('#finish');
    this.cancelButton = page.locator('#cancel');
    this.errorMessage = page.locator('[data-test="error"]');
    this.itemTotal = page.locator('.summary_subtotal_label');
    this.tax = page.locator('.summary_tax_label');
    this.total = page.locator('.summary_total_label');
    this.orderComplete = page.locator('.complete-header');
  }

  /**
   * Fill in checkout step 1 (shipping info)
   */
  async fillShippingInfo(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  /**
   * Click continue button to go to checkout step 2
   */
  async clickContinue() {
    await this.continueButton.click();
  }

  /**
   * Complete checkout by filling info and clicking continue
   */
  async continueCheckout(firstName: string, lastName: string, postalCode: string) {
    await this.fillShippingInfo(firstName, lastName, postalCode);
    await this.clickContinue();
  }

  /**
   * Finish the order
   */
  async finishOrder() {
    await this.finishButton.click();
  }

  /**
   * Cancel checkout and return to cart
   */
  async cancel() {
    await this.cancelButton.click();
  }

  /**
   * Get error message (if displayed)
   */
  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  /**
   * Check if order completion message is visible
   */
  async isOrderComplete() {
    return await this.orderComplete.isVisible();
  }

  /**
   * Get order completion text
   */
  async getCompletionMessage() {
    return await this.orderComplete.textContent();
  }

  /**
   * Get item total from order review
   */
  async getItemTotal() {
    const text = await this.itemTotal.textContent();
    const match = text?.match(/\$(.+)/);
    return match ? parseFloat(match[1]) : 0;
  }
}
