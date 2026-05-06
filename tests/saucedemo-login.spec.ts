import { test, expect } from '../fixtures/pom-fixtures';
import { SauceDemoUsers } from '../utils/test-data';

test.describe('SauceDemo Authentication', () => {
  test('successful login with standard user', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(SauceDemoUsers.standard);

    await expect(page).toHaveURL(/\/inventory\.html$/);
    const productCount = await inventoryPage.getProductItems();
    expect(productCount).toBeGreaterThan(0);
  });

  test('login fails with locked out user', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.fillUsername(SauceDemoUsers.locked.username);
    await loginPage.fillPassword(SauceDemoUsers.locked.password);
    await loginPage.clickLogin();

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('locked out');
  });

  test('login fails with invalid credentials', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.fillUsername('invalid_user');
    await loginPage.fillPassword('wrong_password');
    await loginPage.clickLogin();

    await expect(loginPage.errorMessage).toBeVisible();
  });
});

test.describe('SauceDemo Products & Inventory', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.login(SauceDemoUsers.standard);
  });

  test('display all products on inventory page', async ({ inventoryPage }) => {
    const productCount = await inventoryPage.getProductItems();
    expect(productCount).toBe(6);
  });

  test('products are displayed on inventory page', async ({ inventoryPage }) => {
    const productCount = await inventoryPage.getProductItems();
    expect(productCount).toBe(6);

    // Verify first product has all details
    const firstProduct = await inventoryPage.getProductByIndex(0);
    expect(firstProduct.name).toBeTruthy();
    expect(firstProduct.price).toContain('$');
    expect(firstProduct.description).toBeTruthy();
  });

  test('can interact with product add to cart buttons', async ({ inventoryPage }) => {
    // Verify we can add first product to cart
    await inventoryPage.addToCartByIndex(0);
    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(1);
  });
});

test.describe('SauceDemo Shopping Cart', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.login(SauceDemoUsers.standard);
  });

  test('add products to cart and verify count', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCartByIndex(0);
    await inventoryPage.addToCartByIndex(1);

    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(2);

    await inventoryPage.goToCart();
    const itemsInCart = await cartPage.getCartItemCount();
    expect(itemsInCart).toBe(2);
  });

  test('remove products from cart', async ({ inventoryPage, cartPage }) => {
    await inventoryPage.addToCartByIndex(0);
    await inventoryPage.addToCartByIndex(1);
    await inventoryPage.goToCart();

    await cartPage.removeItemByIndex(0);
    const itemsInCart = await cartPage.getCartItemCount();
    expect(itemsInCart).toBe(1);
  });

  test('continue shopping from cart', async ({ page, inventoryPage, cartPage }) => {
    await inventoryPage.addToCartByIndex(0);
    await inventoryPage.goToCart();
    await cartPage.continueShopping();

    await expect(page).toHaveURL(/\/inventory\.html$/);
  });
});

test.describe('SauceDemo Checkout', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.login(SauceDemoUsers.standard);
  });

  test('complete full checkout flow', async ({ inventoryPage, cartPage, checkoutPage }) => {
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

  test('checkout fails with missing first name', async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addToCartByIndex(0);
    await inventoryPage.goToCart();
    await cartPage.checkout();

    // Leave first name empty
    await checkoutPage.fillShippingInfo('', 'Doe', '12345');
    await checkoutPage.clickContinue();

    await expect(checkoutPage.errorMessage).toBeVisible();
  });
});

test.describe('SauceDemo Logout', () => {
  test('logout from inventory page', async ({ page, loginPage, inventoryPage }) => {
    await loginPage.login(SauceDemoUsers.standard);
    await expect(page).toHaveURL(/\/inventory\.html$/);

    await inventoryPage.logout();
    await expect(page).toHaveURL(/\/$/);
  });
});

