import { test } from '@playwright/test';
import { TodoPage } from '../pageObject/TodoPage';

test.describe('Scenario 3: Filtering & Deleting Tasks Tests', () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.navigate();
    
    // Clear initial/default tasks to ensure a clean baseline
    const count = await todoPage.todoItems.count();
    for (let i = 0; i < count; i++) {
      await todoPage.deleteFirstTaskAndVerify(count - 1 - i);
    }
  });

  test('Filter and delete tasks across different views', async () => {
    await test.step('Set up initial active and completed tasks', async () => {
      await todoPage.createTodoAndVerify('Task 1');
      await todoPage.createTodoAndVerify('Task 2');
      await todoPage.firstTodoCheckbox.check();
    });

    await test.step('Filter tasks by Active state', async () => {
      await todoPage.filterByActiveAndVerify(1);
    });

    await test.step('Filter tasks by Completed state', async () => {
      await todoPage.filterByCompletedAndVerify(1);
    });

    await test.step('Filter back to All tasks', async () => {
      await todoPage.filterByAllAndVerify(2);
    });

    await test.step('Delete first task and verify count drops to 1', async () => {
      await todoPage.deleteFirstTaskAndVerify(1);
    });
  });
});