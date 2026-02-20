import { test, expect } from '@playwright/test';
import { SauceDemoUsers } from '../utils/test-data';

test('login with test data helper', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.locator('#user-name').fill(SauceDemoUsers.standard.username);
  await page.locator('#password').fill(SauceDemoUsers.standard.password);
  await page.locator('#login-button').click();

await expect(page).toHaveURL(/\/inventory\.html$/);
});

