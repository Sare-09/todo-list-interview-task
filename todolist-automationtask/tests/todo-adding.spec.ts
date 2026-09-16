import { test, expect } from '@playwright/test';
import { TodoPage } from '../pageObject/TodoPage';

test.describe('1. Adding Tasks & Input Validation', () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.navigate();

  
    await expect(todoPage.todoItems).toHaveCount(2);
  });

  const testCases = [
    { taskName: 'Buy groceries' },
    { taskName: '12345 Numeric Task' },
    { taskName: 'Special chars !@#$%^' },
  ];

  for (const { taskName } of testCases) {
    test(`Add new item: "${taskName}"`, async () => {
     
      const initialCount = await todoPage.todoItems.count();
      await todoPage.createTodo(taskName);

      const item = todoPage.getTodoItemByText(taskName);
      await expect(item).toBeVisible();

      const expectedCount = initialCount + 1;
      await expect(todoPage.todoCount).toHaveText(`${expectedCount} items left`);
    });
  }
   
  
  test('Trimming whitespace on task creation', async () => {
    const paddedTask = '   Buy dog food   ';
    const trimmedTask = 'Buy dog food';
    
    await todoPage.createTodo(paddedTask);``
    const item = todoPage.getTodoItemByText(trimmedTask);
    await expect(item).toBeVisible();
    await expect(item).toHaveCount(1);
  });

});