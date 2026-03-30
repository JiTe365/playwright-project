import { test, expect } from '@playwright/test';
import { SauceDemoUsers } from '../utils/test-data';
import { SauceDemoLoginPage } from '../utils/SauceDemoLoginPage';
import { SauceDemoInventoryPage } from '../utils/SauceDemoInventoryPage';

test('login with test data helper', async ({ page }) => {
  const loginPage = new SauceDemoLoginPage(page);
  const inventoryPage = new SauceDemoInventoryPage(page);

  await loginPage.login(SauceDemoUsers.standard);

  await expect(page).toHaveURL(/\/inventory\.html$/);
  
  // Verify we're on the inventory page with products visible
  const productCount = await inventoryPage.getProductItems();
  expect(productCount).toBeGreaterThan(0);
});



