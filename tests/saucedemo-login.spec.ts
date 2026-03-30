import { test, expect } from '@playwright/test';
import { SauceDemoUsers } from '../utils/test-data';
import { SauceDemoLoginPage } from '../utils/SauceDemoLoginPage';
import { SauceDemoInventoryPage } from '../utils/SauceDemoInventoryPage';
import { SauceDemoCartPage } from '../utils/SauceDemoCartPage';
import { SauceDemoCheckoutPage } from '../utils/SauceDemoCheckoutPage';

test.describe('SauceDemo Authentication', () => {
  test('successful login with standard user', async ({ page }) => {
    const loginPage = new SauceDemoLoginPage(page);
    const inventoryPage = new SauceDemoInventoryPage(page);

    await loginPage.login(SauceDemoUsers.standard);

    await expect(page).toHaveURL(/\/inventory\.html$/);
    const productCount = await inventoryPage.getProductItems();
    expect(productCount).toBeGreaterThan(0);
  });

  test('login fails with locked out user', async ({ page }) => {
    const loginPage = new SauceDemoLoginPage(page);

    await loginPage.goto();
    await loginPage.fillUsername(SauceDemoUsers.locked.username);
    await loginPage.fillPassword(SauceDemoUsers.locked.password);
    await loginPage.clickLogin();

    const errorVisible = await loginPage.isErrorVisible();
    expect(errorVisible).toBe(true);
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain('locked out');
  });

  test('login fails with invalid credentials', async ({ page }) => {
    const loginPage = new SauceDemoLoginPage(page);

    await loginPage.goto();
    await loginPage.fillUsername('invalid_user');
    await loginPage.fillPassword('wrong_password');
    await loginPage.clickLogin();

    const errorVisible = await loginPage.isErrorVisible();
    expect(errorVisible).toBe(true);
  });
});

test.describe('SauceDemo Products & Inventory', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new SauceDemoLoginPage(page);
    await loginPage.login(SauceDemoUsers.standard);
  });

  test('display all products on inventory page', async ({ page }) => {
    const inventoryPage = new SauceDemoInventoryPage(page);

    const productCount = await inventoryPage.getProductItems();
    expect(productCount).toBe(6);
  });

  test('display product details correctly', async ({ page }) => {
    const inventoryPage = new SauceDemoInventoryPage(page);

    const product = await inventoryPage.getProductByIndex(0);
    expect(product.name).toBeTruthy();
    expect(product.price).toContain('$');
    expect(product.description).toBeTruthy();
  });

  test('filter products by price (low to high)', async ({ page }) => {
    const inventoryPage = new SauceDemoInventoryPage(page);

    await inventoryPage.filterBy('price-asc');
    
    const firstProduct = await inventoryPage.getProductByIndex(0);
    const secondProduct = await inventoryPage.getProductByIndex(1);
    
    const firstPrice = parseFloat(firstProduct.price?.replace('$', '') || '0');
    const secondPrice = parseFloat(secondProduct.price?.replace('$', '') || '0');
    
    expect(firstPrice).toBeLessThanOrEqual(secondPrice);
  });

  test('filter products by name (a to z)', async ({ page }) => {
    const inventoryPage = new SauceDemoInventoryPage(page);

    await inventoryPage.filterBy('name-asc');
    
    const firstProduct = await inventoryPage.getProductByIndex(0);
    const secondProduct = await inventoryPage.getProductByIndex(1);
    
    expect(firstProduct.name).toBeTruthy();
    expect(secondProduct.name).toBeTruthy();
    expect(firstProduct.name).toBeLessThan(secondProduct.name!);
  });
});

test.describe('SauceDemo Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new SauceDemoLoginPage(page);
    await loginPage.login(SauceDemoUsers.standard);
  });

  test('add products to cart and verify count', async ({ page }) => {
    const inventoryPage = new SauceDemoInventoryPage(page);
    const cartPage = new SauceDemoCartPage(page);

    await inventoryPage.addToCartByIndex(0);
    await inventoryPage.addToCartByIndex(1);

    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(2);

    await inventoryPage.goToCart();
    const itemsInCart = await cartPage.getCartItemCount();
    expect(itemsInCart).toBe(2);
  });

  test('remove products from cart', async ({ page }) => {
    const inventoryPage = new SauceDemoInventoryPage(page);
    const cartPage = new SauceDemoCartPage(page);

    await inventoryPage.addToCartByIndex(0);
    await inventoryPage.addToCartByIndex(1);
    await inventoryPage.goToCart();

    await cartPage.removeItemByIndex(0);
    const itemsInCart = await cartPage.getCartItemCount();
    expect(itemsInCart).toBe(1);
  });

  test('continue shopping from cart', async ({ page }) => {
    const inventoryPage = new SauceDemoInventoryPage(page);
    const cartPage = new SauceDemoCartPage(page);

    await inventoryPage.addToCartByIndex(0);
    await inventoryPage.goToCart();
    await cartPage.continueShopping();

    await expect(page).toHaveURL(/\/inventory\.html$/);
  });
});

test.describe('SauceDemo Checkout', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new SauceDemoLoginPage(page);
    await loginPage.login(SauceDemoUsers.standard);
  });

  test('complete full checkout flow', async ({ page }) => {
    const inventoryPage = new SauceDemoInventoryPage(page);
    const cartPage = new SauceDemoCartPage(page);
    const checkoutPage = new SauceDemoCheckoutPage(page);

    // Add items to cart
    await inventoryPage.addToCartByIndex(0);
    await inventoryPage.addToCartByIndex(1);

    // Go to cart and checkout
    await inventoryPage.goToCart();
    await cartPage.checkout();

    // Fill shipping information
    await checkoutPage.continueCheckout('John', 'Doe', '12345');

    // Finish order
    await checkoutPage.finishOrder();

    // Verify order completion
    const isComplete = await checkoutPage.isOrderComplete();
    expect(isComplete).toBe(true);

    const message = await checkoutPage.getCompletionMessage();
    expect(message).toContain('Thank you');
  });

  test('checkout fails with missing first name', async ({ page }) => {
    const inventoryPage = new SauceDemoInventoryPage(page);
    const cartPage = new SauceDemoCartPage(page);
    const checkoutPage = new SauceDemoCheckoutPage(page);

    await inventoryPage.addToCartByIndex(0);
    await inventoryPage.goToCart();
    await cartPage.checkout();

    // Leave first name empty
    await checkoutPage.fillShippingInfo('', 'Doe', '12345');
    await checkoutPage.clickContinue();

    const errorVisible = await checkoutPage.page.locator('[data-test="error"]').isVisible();
    expect(errorVisible).toBe(true);
  });
});

test.describe('SauceDemo Logout', () => {
  test('logout from inventory page', async ({ page }) => {
    const loginPage = new SauceDemoLoginPage(page);
    const inventoryPage = new SauceDemoInventoryPage(page);

    await loginPage.login(SauceDemoUsers.standard);
    await expect(page).toHaveURL(/\/inventory\.html$/);

    await inventoryPage.logout();
    await expect(page).toHaveURL(/\/$/);
  });
});

