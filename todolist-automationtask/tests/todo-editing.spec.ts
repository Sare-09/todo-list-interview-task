import { test } from '@playwright/test';
import { TodoPage } from '../pageObject/TodoPage';

test.describe('Scenario 5: Editing Tasks Tests', () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.navigate();
  });

  test('Edit active first task', async () => {
    await test.step('Create initial task', async () => {
      await todoPage.createTodoAndVerify('Buy groceries');
    });

    await test.step('Edit active task text and verify update', async () => {
      await todoPage.editFirstTaskAndVerify('Buy organic groceries');
    });
  });

  test('Edit completed first task', async () => {
    await test.step('Create initial task', async () => {
      await todoPage.createTodoAndVerify('Pay electric bill');
    });

    await test.step('Edit completed task text and verify update', async () => {
      await todoPage.editCompletedFirstTaskAndVerify('Pay electric bill updated');
    });
  });
});