import { expect, Locator, Page } from '@playwright/test';

export class TodoPage {
  readonly page: Page;
  readonly newTodoInput: Locator;
  readonly todoItems: Locator;
  readonly todoCount: Locator;
  readonly firstTodoCheckbox: Locator;
  readonly filterAll: Locator;
  readonly filterActive: Locator;
  readonly filterCompleted: Locator;
  readonly clearCompletedButton: Locator;
  readonly firstTaskLabel: Locator;
  readonly firstTaskEditInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newTodoInput = page.locator('//input[@class="new-todo"]');
    this.todoItems = page.locator('//ul[@class="todo-list"]/li');
    this.todoCount = page.locator('//span[@class="todo-count"]');
    this.firstTodoCheckbox = page.locator('(//input[@class="toggle"])[1]');
    this.filterAll = page.locator('//a[normalize-space(text())="All"]');
    this.filterActive = page.locator('//a[normalize-space(text())="Active"]');
    this.filterCompleted = page.locator('//a[normalize-space(text())="Completed"]');
    this.clearCompletedButton = page.locator('//button[@class="todo-button clear-completed"]');
    this.firstTaskLabel = page.locator('(//ul[@class="todo-list"]/li//label)[1]');
    this.firstTaskEditInput = page.locator('(//ul[@class="todo-list"]/li//input[@class="edit"])[1]');
  }

  async navigate() {
    await this.page.goto('http://localhost:8080/todo');
    await this.page.evaluate(() => localStorage.clear());
    await this.page.reload();
    await this.newTodoInput.waitFor();
  }



  // --- SCENARIO 1: ADDING TASKS & INPUT BOUNDARIES ---


  async createTodoAndVerify(todoText: string) {
    const initialCount = await this.todoItems.count();
    await this.newTodoInput.fill(todoText);
    await this.newTodoInput.press('Enter');
    await expect(this.todoItems).toHaveCount(initialCount + 1);
    await expect(this.todoItems.last().locator('label')).toHaveText(todoText);
  }


  async createTodoAndVerifyTrimmedText(inputWithSpaces: string, expectedTrimmedText: string) {
    const initialCount = await this.todoItems.count();
    await this.newTodoInput.fill(inputWithSpaces);
    await this.newTodoInput.press('Enter');
    await expect(this.todoItems).toHaveCount(initialCount + 1);
    await expect(this.todoItems.last().locator('label')).toHaveText(expectedTrimmedText);
  }

  async attemptEmptyTodoSubmission(expectedTotalCount: number) {
    await this.newTodoInput.waitFor();
    await this.newTodoInput.fill('   ');
    await this.newTodoInput.press('Enter');
    await expect(this.todoItems).toHaveCount(expectedTotalCount);
  }

  async verifySpecialCharactersInput(specialString: string) {
    const initialCount = await this.todoItems.count();
    await this.newTodoInput.fill(specialString);
    await this.newTodoInput.press('Enter');
    await expect(this.todoItems).toHaveCount(initialCount + 1);
    await expect(this.todoItems.last().locator('label')).toHaveText(specialString);
  }

  async verifyBoundaryLengthInput(length: number) {
    const initialCount = await this.todoItems.count();
    const boundaryString = 'a'.repeat(length);
    await this.newTodoInput.fill(boundaryString);
    await this.newTodoInput.press('Enter');
    await expect(this.todoItems).toHaveCount(initialCount + 1);
    await expect(this.todoItems.last().locator('label')).toHaveText(boundaryString);
  }

  

  // --- SCENARIO 2: COMPLETING TASKS ---

  async cycleAllTasksSelection() {
    const totalCount = await this.todoItems.count();

    for (let i = 0; i < totalCount; i++) {
      const currentItem = this.todoItems.nth(i);
      const currentCheckbox = currentItem.locator('//input[@class="toggle"]');

    
      await currentCheckbox.waitFor();
      await currentCheckbox.check();
      await expect(currentItem).toHaveClass(/completed/);
      await expect(this.todoCount).toHaveText(`${totalCount - 1} item left`);

      
      await currentCheckbox.uncheck();
      await expect(currentItem).not.toHaveClass(/completed/);
      await expect(this.todoCount).toHaveText(`${totalCount} items left`);
    }
  }

  // --- SCENARIO 3: EDITING TASKS & CANCELLATION ---

  async editFirstTaskAndVerify(newText: string) {
    const firstItem = this.todoItems.first();
    await this.firstTaskLabel.waitFor();
    await this.firstTaskLabel.dblclick();
    await expect(firstItem).toHaveClass(/editing/);
    await this.firstTaskEditInput.waitFor();
    await this.firstTaskEditInput.fill(newText);
    await this.firstTaskEditInput.press('Enter');
    await expect(this.firstTaskLabel).toHaveText(newText);
  }

  async cancelEditingTaskWithEscape(originalText: string, draftText: string) {
    const lastItem = this.todoItems.last();
    const lastTaskLabel = lastItem.locator('label');
    const editInput = lastItem.locator('.edit');
    await lastTaskLabel.dblclick();
    await editInput.fill(draftText);
    await editInput.press('Escape');
    await expect(lastItem).not.toHaveClass(/editing/);
    await expect(lastTaskLabel).toHaveText(originalText);
  }

  async editCompletedFirstTaskAndVerify(newText: string) {
    const firstItem = this.todoItems.first();
    const firstCheckbox = this.firstTodoCheckbox.first();
    await firstCheckbox.waitFor();
    await firstCheckbox.check();
    await expect(firstItem).toHaveClass(/completed/);
    await this.firstTaskLabel.waitFor();
    await this.firstTaskLabel.dblclick();
    await expect(firstItem).toHaveClass(/completed/);
    await expect(firstItem).toHaveClass(/editing/);
    await this.firstTaskEditInput.waitFor();
    await this.firstTaskEditInput.fill(newText);
    await this.firstTaskEditInput.press('Enter');
    await expect(this.firstTaskLabel).toHaveText(newText);
    await expect(firstItem).toHaveClass(/completed/);
  }

  // --- SCENARIO 4: FILTERING & DELETING TASKS ---

  async filterByActiveAndVerify(expectedVisibleCount: number) {
    await this.filterActive.waitFor();
    await this.filterActive.click();
    await expect(this.todoItems).toHaveCount(expectedVisibleCount);
  }

  async filterByCompletedAndVerify(expectedVisibleCount: number) {
    await this.filterCompleted.waitFor();
    await this.filterCompleted.click();
    await expect(this.todoItems).toHaveCount(expectedVisibleCount);
  }

  async filterByAllAndVerify(expectedVisibleCount: number) {
    await this.filterAll.waitFor();
    await this.filterAll.click();
    await expect(this.todoItems).toHaveCount(expectedVisibleCount);
  }

  async deleteFirstTaskAndVerify(expectedTotalCount: number) {
    const firstItem = this.todoItems.first();
    await firstItem.waitFor();
    await firstItem.hover();
    const deleteButton = firstItem.locator('//button[@class="destroy todo-button"]');
    await deleteButton.waitFor({ state: 'attached' });
    await deleteButton.click({ force: true });
    await expect(this.todoItems).toHaveCount(expectedTotalCount);
  }

  async clearCompletedTasksAndVerify(expectedRemainingCount: number) {
    await this.clearCompletedButton.waitFor();
    await this.clearCompletedButton.click();
    await expect(this.todoItems).toHaveCount(expectedRemainingCount);
    await expect(this.clearCompletedButton).not.toBeVisible();
  }

  // --- SCENARIO 5: BULK CREATION & SCALABILITY ---

  async bulkCreateTodos(count: number) {
    const initialCount = await this.todoItems.count();

    for (let i = 1; i <= count; i++) {
    await this.newTodoInput.fill(`Bulk Task ${i}`);
    await this.newTodoInput.press('Enter');
  }
   const expectedTotal = initialCount + count;
    await expect(this.todoItems).toHaveCount(expectedTotal);
    await expect(this.todoCount).toHaveText(`${expectedTotal} items left`);
  }

}