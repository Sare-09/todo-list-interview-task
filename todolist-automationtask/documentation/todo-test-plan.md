# Test Plan: Task Management (ToDo Application)

## Overview
This test plan defines the end-to-end acceptance scenarios for the web-based task management application (ToDo app). The plan uses Gherkin syntax to ensure clear, behavioral specification of the application's capabilities, including task creation, completion, editing, filtering, and deletion.

---

## Gherkin Test Plan

```gherkin
Feature: Task Management (ToDo App)
  As a user of the ToDo application
  I want to create, complete, filter, edit, and delete tasks
  So that I can effectively manage my daily workload

  Background:
    Given the user navigates to the ToDo application

  # ==========================================
  # 1. ADDING TASKS & INPUT BOUNDARIES
  # ==========================================

  Scenario Outline: Add new items to the todo list
    When the user enters "<task_name>" into the task input field
    And presses the enter key
    Then the task list should contain "<task_name>"
    And the remaining task count should update correctly

    Examples:
      | task_name             |
      | Buy groceries         |
      | 12345 Numeric Task    |
      | Special chars !@#$%^  |

  Scenario: Trimming whitespace on task creation
    When the user enters "   Walk the dog   " into the task input field
    And presses the enter key
    Then the task list should display "Walk the dog" without leading or trailing spaces

  Scenario Outline: Add a task with boundary length text
    When the user enters a task with length <character_count>
    And presses the enter key
    Then the task list <expected_result>

    Examples:
      | character_count | expected_result                                      |
      | 1               | should display the 1-character task                  |
      | 255             | should display the full 255-character task           |
      | 256             | should truncate the text or reject creation          |

  Scenario: Create task with maximum length string
    When the user enters a 255-character string into the task input field
    And presses the enter key
    Then the task should be created successfully with all 255 characters preserved

  Scenario: Prevent single-line overflow on extremely long unbroken strings
    When the user enters "a" repeated 300 times into the task input field
    And presses the enter key
    Then the task item should handle the long string without breaking the UI layout

  # ==========================================
  # 2. MARKING TASKS AS COMPLETED
  # ==========================================

  Scenario: Toggle a single task as completed
    Given a task "Pay utility bills" exists on the list
    When the user clicks the checkbox next to "Pay utility bills"
    Then the task "Pay utility bills" should be visually marked as completed
    And the active items counter should decrease by 1

  Scenario: Uncheck a completed task
    Given a task "Clean the desk" is marked as completed
    When the user unchecks the checkbox for "Clean the desk"
    Then the task "Clean the desk" should be marked as active
    And the active items counter should increase by 1

  # ==========================================
  # 3. EDITING TASKS
  # ==========================================

  Scenario: Edit an existing task item
    Given a task "Write report" exists on the list
    When the user double-clicks on "Write report"
    And changes the text to "Write quarterly report"
    And presses the enter key
    Then the task list should contain "Write quarterly report"
    And "Write report" should no longer exist

  Scenario: Cancel editing on Escape key
    Given a task "Review PR" exists on the list
    When the user double-clicks on "Review PR"
    And changes the text to "Draft PR"
    And presses the escape key
    Then the task list should still display "Review PR"

  # ==========================================
  # 4. FILTERING & VIEWS
  # ==========================================

  Scenario Outline: Filter tasks by state
    Given the todo list contains active and completed tasks
    When the user selects the "<filter>" filter
    Then only tasks with state "<visible_state>" should be displayed

    Examples:
      | filter    | visible_state |
      | All       | all           |
      | Active    | active        |
      | Completed | completed     |

  # ==========================================
  # 5. DELETING & CLEARING TASKS
  # ==========================================

  Scenario: Delete a single task item
    Given a task "Remove garbage" exists on the list
    When the user hovers over "Remove garbage"
    And clicks the delete button
    Then "Remove garbage" should be removed from the list

  Scenario: Clear all completed tasks
    Given there are both active and completed tasks on the list
    When the user clicks the "Clear completed" button
    Then all completed tasks should be removed
    And the "Clear completed" button should no longer be visible
    And only active tasks should remain on the list


  # ==========================================
  # 6. LIST SCALABILITY & UI LAYOUT
  # ==========================================

  Scenario Outline: Verify list scalability with large number of tasks
    When the user creates <task_count> tasks in the list
    Then all <task_count> tasks should be present in the task list
    And a vertical scrollbar should appear when tasks exceed the visible viewport

    Examples:
      | task_count |
      | 50         |
      | 100        |

  Scenario: Maintain container layout and counter integrity under high load
    When the user creates 50 tasks
    Then the active item counter should display "50 items left"
    And the action buttons (filters, clear completed) should remain visible and accessible at the bottom