import { test } from '@playwright/test';
import { TodoPage } from '../pageObject/TodoPage';

test.describe('Scenario 2: Completing Tasks Tests', () => {
 let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.navigate();
  });

  test('Cycle select and unselect state for each task', async () => {
    await test.step('Iterate through all items and verify toggle logic', async () => {
      await todoPage.cycleAllTasksSelection();
    });
  });
});