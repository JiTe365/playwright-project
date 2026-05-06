import { test as base, expect } from '@playwright/test';
import { SauceDemoCartPage } from '../utils/SauceDemoCartPage';
import { SauceDemoCheckoutPage } from '../utils/SauceDemoCheckoutPage';
import { SauceDemoInventoryPage } from '../utils/SauceDemoInventoryPage';
import { SauceDemoLoginPage } from '../utils/SauceDemoLoginPage';
import { TodoMVCPage } from '../utils/TodoMVCPage';

type PomFixtures = {
  loginPage: SauceDemoLoginPage;
  inventoryPage: SauceDemoInventoryPage;
  cartPage: SauceDemoCartPage;
  checkoutPage: SauceDemoCheckoutPage;
  todoPage: TodoMVCPage;
};

export const test = base.extend<PomFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new SauceDemoLoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new SauceDemoInventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new SauceDemoCartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new SauceDemoCheckoutPage(page));
  },
  todoPage: async ({ page }, use) => {
    await use(new TodoMVCPage(page));
  },
});

export { expect };
