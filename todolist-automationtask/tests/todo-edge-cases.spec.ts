import { test } from '@playwright/test';
import { TodoPage } from '../pageObject/TodoPage';

test.describe('Scenario 6: Edge Cases, Input Boundaries & Bulk Scalability', () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.navigate();
  });

  test('Trimming whitespace on task creation', async () => {
    await todoPage.createTodoAndVerifyTrimmedText('   Walk the dog   ', 'Walk the dog');
  });

  test('Prevent empty whitespace task submission', async () => {
    const initialCount = await todoPage.todoItems.count();
    await todoPage.attemptEmptyTodoSubmission(initialCount);
  });

  test('Cancel task editing using Escape key', async () => {
    await todoPage.createTodoAndVerify('Original Task');
    await todoPage.cancelEditingTaskWithEscape('Original Task', 'Draft Edit Text');
  });

  test('Verify list scalability with bulk task creation', async () => {
    await todoPage.bulkCreateTodos(10);
  });

  test('Character Validation: Special characters and numeric strings', async () => {
    await todoPage.verifySpecialCharactersInput('Special chars !@#$%^&*()');
  });

  test('Character Limitation: Boundary string lengths', async () => {
    await test.step('Test 1-character minimum boundary', async () => {
      await todoPage.verifyBoundaryLengthInput(1);
    });

    await test.step('Test 255-character maximum boundary', async () => {
      await todoPage.verifyBoundaryLengthInput(255);
    });

    await test.step('Test 300-character unbroken string UI overflow protection', async () => {
      await todoPage.verifyBoundaryLengthInput(300);
    });
  });
});