import { test } from '@playwright/test';
import { TodoPage } from '../pageObject/TodoPage';

test.describe('Scenario 1: Adding Tasks Tests', () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.navigate();
  });

  test('Create new tasks and verify item list count', async () => {
   await test.step('Add multiple tasks and verify item list count', async () => {
      await todoPage.createTodoAndVerify('Buy groceries');
      await todoPage.createTodoAndVerify('Clean the house');
    });
  });
});