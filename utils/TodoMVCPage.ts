import { Page, Locator } from '@playwright/test';

/**
 * Page Object Model for TodoMVC
 * Encapsulates selectors and actions for todo management
 */
export class TodoMVCPage {
  readonly page: Page;
  readonly newTodoInput: Locator;
  readonly todoItems: Locator;
  readonly todoTitles: Locator;
  readonly todoCheckboxes: Locator;
  readonly todoCount: Locator;
  readonly clearCompletedButton: Locator;
  readonly activeFilter: Locator;
  readonly completedFilter: Locator;
  readonly allFilter: Locator;

  constructor(page: Page, baseUrl = 'https://demo.playwright.dev/todomvc') {
    this.page = page;
    this.newTodoInput = page.getByPlaceholder('What needs to be done?');
    this.todoItems = page.getByTestId('todo-item');
    this.todoTitles = page.getByTestId('todo-title');
    this.todoCheckboxes = page.getByTestId('todo-item').getByRole('checkbox');
    this.todoCount = page.getByTestId('todo-count');
    this.clearCompletedButton = page.getByRole('button', { name: 'Clear completed' });
    this.activeFilter = page.getByRole('link', { name: 'Active' });
    this.completedFilter = page.getByRole('link', { name: 'Completed' });
    this.allFilter = page.getByRole('link', { name: 'All' });
    this.baseUrl = baseUrl;
  }

  private baseUrl: string;

  /**
   * Navigate to TodoMVC app
   */
  async goto() {
    await this.page.goto(this.baseUrl);
  }

  /**
   * Add a new todo item
   */
  async addTodo(title: string) {
    await this.newTodoInput.fill(title);
    await this.newTodoInput.press('Enter');
  }

  /**
   * Add multiple todo items
   */
  async addMultipleTodos(titles: string[]) {
    for (const title of titles) {
      await this.addTodo(title);
    }
  }

  /**
   * Complete a todo by index
   */
  async completeTodoByIndex(index: number) {
    await this.todoItems.nth(index).getByRole('checkbox').check();
  }

  /**
   * Uncomplete a todo by index
   */
  async uncompleteTodoByIndex(index: number) {
    await this.todoItems.nth(index).getByRole('checkbox').uncheck();
  }

  /**
   * Delete a todo by index (double-click to enter edit mode, then delete)
   */
  async deleteTodoByIndex(index: number) {
    const item = this.todoItems.nth(index);
    await item.dblclick();
    await item.getByRole('textbox').press('Escape');
    // Alternative: find delete button if available
    const deleteButton = item.locator('button.destroy');
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
    }
  }

  /**
   * Edit a todo by index
   */
  async editTodoByIndex(index: number, newTitle: string) {
    const item = this.todoItems.nth(index);
    await item.dblclick();
    const editInput = item.getByRole('textbox');
    await editInput.clear();
    await editInput.fill(newTitle);
    await editInput.press('Enter');
  }

  /**
   * Get todo count
   */
  async getTodoCount() {
    const text = await this.todoCount.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Get all todo titles
   */
  async getAllTodos() {
    return await this.todoTitles.allTextContents();
  }

  /**
   * Get number of todo items
   */
  async getTodoItemCount() {
    return await this.todoItems.count();
  }

  /**
   * Clear all completed todos
   */
  async clearCompleted() {
    await this.clearCompletedButton.click();
  }

  /**
   * Filter todos by status
   */
  async filterBy(status: 'active' | 'completed' | 'all') {
    switch (status) {
      case 'active':
        await this.activeFilter.click();
        break;
      case 'completed':
        await this.completedFilter.click();
        break;
      case 'all':
        await this.allFilter.click();
        break;
    }
  }
}
