import { test, expect } from '@playwright/test';

const TODO_MVC_URL = 'https://demo.playwright.dev/todomvc';

test.describe('TodoMVC', () => {
  test('can add a todo item', async ({ page }) => {
    await page.goto(TODO_MVC_URL);

    const newTodo = page.getByPlaceholder('What needs to be done?');

    await newTodo.fill('Buy milk');
    await newTodo.press('Enter');

    await expect(page.getByTestId('todo-title')).toHaveText(['Buy milk']);
    await expect(page.getByTestId('todo-count')).toContainText('1 item left');
  });

  test('can complete and clear a todo item', async ({ page }) => {
    await page.goto(TODO_MVC_URL);

    const newTodo = page.getByPlaceholder('What needs to be done?');

    await newTodo.fill('Walk the dog');
    await newTodo.press('Enter');

    // Mark completed
    await page.getByTestId('todo-item').getByRole('checkbox').check();

    await expect(page.getByTestId('todo-item')).toHaveClass(/completed/);
    await expect(page.getByTestId('todo-count')).toContainText('0 items left');

    // Clear completed
    await page.getByRole('button', { name: 'Clear completed' }).click();

    // The list container may disappear; assert there are no items instead
    await expect(page.getByTestId('todo-item')).toHaveCount(0);
  });

  test('can filter Active and Completed', async ({ page }) => {
    await page.goto(TODO_MVC_URL);

    const newTodo = page.getByPlaceholder('What needs to be done?');

    await newTodo.fill('Task A');
    await newTodo.press('Enter');

    await newTodo.fill('Task B');
    await newTodo.press('Enter');

    // Complete Task B
    const items = page.getByTestId('todo-item');
    await items.nth(1).getByRole('checkbox').check();

    // Active filter should show only Task A
    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page.getByTestId('todo-title')).toHaveText(['Task A']);

    // Completed filter should show only Task B
    await page.getByRole('link', { name: 'Completed' }).click();
    await expect(page.getByTestId('todo-title')).toHaveText(['Task B']);
  });
});
