import { Page, Locator } from '@playwright/test';

export class TodoPage {
  readonly page: Page;
  readonly newTodoInput: Locator;
  readonly todoItems: Locator;
  readonly todoCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newTodoInput = page.locator('.new-todo');
    this.todoItems = page.locator('.todo-list li');
    this.todoCount = page.locator('.todo-count');
  }

  async navigate(): Promise<void> {
    await this.page.goto('http://localhost:8080/todo');
    await this.newTodoInput.waitFor({ state: 'visible', timeout: 5000 });
  }

  async createTodo(taskName: string): Promise<void> {
    await this.newTodoInput.waitFor({ state: 'visible' });
    await this.newTodoInput.fill(taskName);
    await this.page.waitForTimeout(500);
    await this.newTodoInput.press('Enter');
  }

  getTodoItemByText(taskName: string): Locator {
    return this.todoItems.filter({ hasText: taskName });
  }
}