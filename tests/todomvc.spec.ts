import { test, expect } from '@playwright/test';
import { TodoMVCPage } from '../utils/TodoMVCPage';

test.describe('TodoMVC', () => {
  let todoPage: TodoMVCPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoMVCPage(page);
    await todoPage.goto();
  });

  test('can add a todo item', async () => {
    await todoPage.addTodo('Buy milk');

    await expect(todoPage.todoTitles).toHaveText(['Buy milk']);
    await expect(todoPage.todoCount).toContainText('1 item left');
  });

  test('can complete and clear a todo item', async () => {
    await todoPage.addTodo('Walk the dog');

    // Mark completed
    await todoPage.completeTodoByIndex(0);

    await expect(todoPage.todoItems.nth(0)).toHaveClass(/completed/);
    await expect(todoPage.todoCount).toContainText('0 items left');

    // Clear completed
    await todoPage.clearCompleted();

    // The list container may disappear; assert there are no items instead
    await expect(todoPage.todoItems).toHaveCount(0);
  });

  test('can filter Active and Completed', async () => {
    await todoPage.addMultipleTodos(['Task A', 'Task B']);

    // Complete Task B
    await todoPage.completeTodoByIndex(1);

    // Active filter should show only Task A
    await todoPage.filterBy('active');
    await expect(todoPage.todoTitles).toHaveText(['Task A']);

    // Completed filter should show only Task B
    await todoPage.filterBy('completed');
    await expect(todoPage.todoTitles).toHaveText(['Task B']);
  });
});


