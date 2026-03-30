import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for SauceDemo cart page
 * Handles cart viewing, item management, and checkout initiation
 */
export class SauceDemoCartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly itemQuantities: Locator;
  readonly cartContents: Locator;
  readonly removeButtons: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
    this.itemQuantities = page.locator('.cart_quantity');
    this.cartContents = page.locator('.cart_list');
    this.removeButtons = page.locator('[id^="remove"]');
    this.continueShoppingButton = page.locator('#continue-shopping');
    this.checkoutButton = page.locator('#checkout');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  /**
   * Get number of items in cart
   */
  async getCartItemCount() {
    return await this.cartItems.count();
  }

  /**
   * Get all item names in cart
   */
  async getCartItemNames() {
    return await this.itemNames.allTextContents();
  }

  /**
   * Get total items quantity in cart
   */
  async getTotalQuantity() {
    const quantities = await this.itemQuantities.allTextContents();
    return quantities.reduce((sum, qty) => sum + parseInt(qty, 10), 0);
  }

  /**
   * Remove item from cart by index
   */
  async removeItemByIndex(index: number) {
    const item = this.cartItems.nth(index);
    await item.locator('[id^="remove"]').click();
  }

  /**
   * Continue shopping (go back to inventory)
   */
  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  /**
   * Proceed to checkout
   */
  async checkout() {
    await this.checkoutButton.click();
  }

  /**
   * Check if cart is empty
   */
  async isCartEmpty() {
    try {
      await this.page.waitForSelector('.cart_item', { state: 'hidden' });
      return true;
    } catch {
      return false;
    }
  }
}
