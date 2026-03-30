import { expect, test } from '@playwright/test';

type TokenUsage = {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
};

type ChatResponse = {
  answer: string;
  usage: TokenUsage;
};

test('captures simulated token usage end to end', async ({ page }) => {
  let tokenUsage: TokenUsage | null = null;

  page.on('response', async (response) => {
    if (response.url().includes('/api/chat') && response.request().method() === 'POST') {
      const body = (await response.json()) as ChatResponse;
      tokenUsage = body.usage;
    }
  });

  await page.goto('/');

  await page.getByLabel('Prompt').fill('Explain how Playwright can verify token usage in tests.');

  const responsePromise = page.waitForResponse(
    (response) => response.url().includes('/api/chat') && response.status() === 200
  );

  await page.getByRole('button', { name: 'Send' }).click();

  const response = await responsePromise;
  const body = (await response.json()) as ChatResponse;

  console.log(
    `Tokens used -> prompt: ${body.usage.prompt_tokens}, completion: ${body.usage.completion_tokens}, total: ${body.usage.total_tokens}`
  );

  expect(body.usage.prompt_tokens).toBeGreaterThan(0);
  expect(body.usage.completion_tokens).toBeGreaterThan(0);
  expect(body.usage.total_tokens).toBe(
    body.usage.prompt_tokens + body.usage.completion_tokens
  );
  expect(body.usage.total_tokens).toBeLessThan(100);

  await expect(page.getByText('Done')).toBeVisible();
  await expect(page.locator('#answer')).toContainText('Playwright lets you automate browsers');
  await expect(page.locator('#promptTokens')).toHaveText(String(body.usage.prompt_tokens));
  await expect(page.locator('#completionTokens')).toHaveText(
    String(body.usage.completion_tokens)
  );
  await expect(page.locator('#totalTokens')).toHaveText(String(body.usage.total_tokens));

  expect(tokenUsage).not.toBeNull();
  expect(tokenUsage).toEqual(body.usage);
});
