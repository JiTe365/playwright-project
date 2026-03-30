import { Page, Locator } from '@playwright/test';
import type { InventoryItem } from './types';

/**
 * Page Object Model for SauceDemo inventory/products page
 * Handles product browsing, filtering, and cart operations
 */
export class SauceDemoInventoryPage {
  readonly page: Page;
  readonly inventoryList: Locator;
  readonly inventoryItems: Locator;
  readonly itemName: Locator;
  readonly itemPrice: Locator;
  readonly itemDescription: Locator;
  readonly addToCartButtons: Locator;
  readonly removeButtons: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly filterDropdown: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryList = page.locator('.inventory_list');
    this.inventoryItems = page.locator('.inventory_item');
    this.itemName = page.locator('.inventory_item_name');
    this.itemPrice = page.locator('.inventory_item_price');
    this.itemDescription = page.locator('.inventory_item_desc');
    this.addToCartButtons = page.locator('[id^="add-to-cart"]');
    this.removeButtons = page.locator('[id^="remove"]');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.filterDropdown = page.locator('select.product_sort_container');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  /**
   * Get all product items on the page
   */
  async getProductItems() {
    return await this.inventoryItems.count();
  }

  /**
   * Get a specific product's details by index
   */
  async getProductByIndex(index: number) {
    const item = this.inventoryItems.nth(index);
    const name = await item.locator('.inventory_item_name').textContent();
    const price = await item.locator('.inventory_item_price').textContent();
    const description = await item.locator('.inventory_item_desc').textContent();

    return { name, price, description };
  }

  /**
   * Add product to cart by index
   */
  async addToCartByIndex(index: number) {
    await this.inventoryItems.nth(index).locator('[id^="add-to-cart"]').click();
  }

  /**
   * Remove product from cart by index
   */
  async removeFromCartByIndex(index: number) {
    await this.inventoryItems.nth(index).locator('[id^="remove"]').click();
  }

  /**
   * Get the cart item count from badge
   */
  async getCartItemCount() {
    try {
      const badge = await this.cartBadge.textContent();
      return badge ? parseInt(badge, 10) : 0;
    } catch {
      return 0;
    }
  }

  /**
   * Navigate to cart
   */
  async goToCart() {
    await this.cartLink.click();
  }

  /**
   * Filter products by sort option
   */
  async filterBy(option: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc') {
    // Use getByRole for better accessibility and reliability
    const select = this.page.locator('select.product_sort_container');
    await select.selectOption(option);
  }

  /**
   * Logout from the application
   */
  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}
