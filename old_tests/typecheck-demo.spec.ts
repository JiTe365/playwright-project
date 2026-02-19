import { test, expect } from '@playwright/test';

test('ts demo', async ({ page }) => {
  //const x: number = "not a number"; // should underline in VS Code
  const x: number = 123;
  await page.goto('/');
  await expect(page).toHaveURL(/.*/);
});
