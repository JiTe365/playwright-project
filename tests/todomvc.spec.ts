import { test, expect } from '@playwright/test';
import { TodoMVCPage } from '../utils/TodoMVCPage';

test.describe('TodoMVC - Basic Operations', () => {
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

  test('can add multiple todo items', async () => {
    await todoPage.addMultipleTodos(['Buy milk', 'Walk the dog', 'Do laundry']);

    const todos = await todoPage.getAllTodos();
    expect(todos).toEqual(['Buy milk', 'Walk the dog', 'Do laundry']);
    await expect(todoPage.todoCount).toContainText('3 items left');
  });

  test('can complete a todo item', async () => {
    await todoPage.addTodo('Buy milk');
    await todoPage.completeTodoByIndex(0);

    await expect(todoPage.todoItems.nth(0)).toHaveClass(/completed/);
    await expect(todoPage.todoCount).toContainText('0 items left');
  });

  test('can uncomplete a todo item', async () => {
    await todoPage.addTodo('Buy milk');
    await todoPage.completeTodoByIndex(0);
    await todoPage.uncompleteTodoByIndex(0);

    await expect(todoPage.todoItems.nth(0)).not.toHaveClass(/completed/);
    await expect(todoPage.todoCount).toContainText('1 item left');
  });
});

test.describe('TodoMVC - Filtering', () => {
  let todoPage: TodoMVCPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoMVCPage(page);
    await todoPage.goto();
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

    // All filter should show both
    await todoPage.filterBy('all');
    await expect(todoPage.todoTitles).toHaveText(['Task A', 'Task B']);
  });

  test('active filter shows correct count', async () => {
    await todoPage.addMultipleTodos(['Task A', 'Task B', 'Task C']);
    await todoPage.completeTodoByIndex(0);
    await todoPage.completeTodoByIndex(2);

    await todoPage.filterBy('active');
    await expect(todoPage.todoCount).toContainText('1 item left');
  });
});

test.describe('TodoMVC - Clearing & Deletion', () => {
  let todoPage: TodoMVCPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoMVCPage(page);
    await todoPage.goto();
  });

  test('can complete and clear all completed todos', async () => {
    await todoPage.addMultipleTodos(['Task A', 'Task B', 'Task C']);
    await todoPage.completeTodoByIndex(0);
    await todoPage.completeTodoByIndex(2);

    await todoPage.clearCompleted();

    const remaining = await todoPage.getAllTodos();
    expect(remaining).toEqual(['Task B']);
    await expect(todoPage.todoCount).toContainText('1 item left');
  });

  test('clear completed button only appears when items are completed', async () => {
    await todoPage.addTodo('Task A');

    // Button should not be visible when no items are completed
    let buttonVisible = await todoPage.clearCompletedButton.isVisible();
    expect(buttonVisible).toBe(false);

    // Complete the item
    await todoPage.completeTodoByIndex(0);

    // Button should now be visible
    buttonVisible = await todoPage.clearCompletedButton.isVisible();
    expect(buttonVisible).toBe(true);
  });

  test('can delete individual todo items', async () => {
    await todoPage.addMultipleTodos(['Task A', 'Task B', 'Task C']);

    // Delete middle item
    await todoPage.deleteTodoByIndex(1);

    const remaining = await todoPage.getAllTodos();
    expect(remaining).toContain('Task A');
    expect(remaining).toContain('Task C');
    expect(remaining).not.toContain('Task B');
  });
});

test.describe('TodoMVC - Editing', () => {
  let todoPage: TodoMVCPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoMVCPage(page);
    await todoPage.goto();
  });

  test('can edit a todo item', async () => {
    await todoPage.addTodo('Buy milk');
    await todoPage.editTodoByIndex(0, 'Buy almond milk');

    const todos = await todoPage.getAllTodos();
    expect(todos).toContain('Buy almond milk');
    expect(todos).not.toContain('Buy milk');
  });

  test('editing with empty text deletes the item', async () => {
    await todoPage.addMultipleTodos(['Task A', 'Task B']);
    
    const item = todoPage.todoItems.nth(0);
    await item.dblclick();
    const editInput = item.getByRole('textbox');
    
    // Clear the input completely
    await editInput.clear();
    await editInput.press('Enter');

    const remaining = await todoPage.getAllTodos();
    expect(remaining).not.toContain('Task A');
    expect(remaining).toContain('Task B');
  });
});

test.describe('TodoMVC - Persistence', () => {
  let todoPage: TodoMVCPage;

  test('todos persist after page reload', async ({ page }) => {
    todoPage = new TodoMVCPage(page);
    await todoPage.goto();

    // Add some todos
    await todoPage.addMultipleTodos(['Task A', 'Task B']);
    await todoPage.completeTodoByIndex(0);

    // Reload the page
    await page.reload();

    // Verify todos are still there
    const todos = await todoPage.getAllTodos();
    expect(todos).toEqual(['Task A', 'Task B']);

    // Verify completion state is preserved
    await expect(todoPage.todoItems.nth(0)).toHaveClass(/completed/);
    await expect(todoPage.todoItems.nth(1)).not.toHaveClass(/completed/);
  });
});

test.describe('TodoMVC - Edge Cases', () => {
  let todoPage: TodoMVCPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoMVCPage(page);
    await todoPage.goto();
  });

  test('cannot add empty todo', async () => {
    // Try to submit empty input
    await todoPage.newTodoInput.press('Enter');

    const itemCount = await todoPage.getTodoItemCount();
    expect(itemCount).toBe(0);
  });

  test('can add todo with very long text', async () => {
    const longText = 'This is a very long todo item that contains many words and should still work properly without any issues ' +
                     'even though it is quite lengthy and might cause some rendering issues on smaller screens';

    await todoPage.addTodo(longText);

    const todos = await todoPage.getAllTodos();
    expect(todos[0]).toContain('This is a very long');
  });

  test('can add todo with special characters', async () => {
    const specialText = 'Buy @milk & eggs! Cost: $5.99';

    await todoPage.addTodo(specialText);

    const todos = await todoPage.getAllTodos();
    expect(todos).toContain(specialText);
  });

  test('todo count updates correctly', async () => {
    await todoPage.addTodo('Task 1');
    await expect(todoPage.todoCount).toContainText('1 item left');

    await todoPage.addTodo('Task 2');
    await expect(todoPage.todoCount).toContainText('2 items left');

    await todoPage.completeTodoByIndex(0);
    await expect(todoPage.todoCount).toContainText('1 item left');
  });
});


