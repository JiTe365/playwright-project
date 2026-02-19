import { test, expect } from '@playwright/test';
import { SauceDemoUsers } from '../utils/test-data';

test('login with test data helper', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  const username = process.env.TEST_USERNAME ?? SauceDemoUsers.standard.username;
  const password = process.env.TEST_PASSWORD ?? SauceDemoUsers.standard.password;

  await page.locator('#user-name').fill(username);
  await page.locator('#password').fill(password);
  await page.locator('#login-button').click();

  // No baseURL dependency:
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  // or robust alternative:
  // await expect(page).toHaveURL(/\/inventory\.html$/);
});

