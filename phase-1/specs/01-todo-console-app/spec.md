# Feature Specification: Todo In-Memory Console App

**Feature Branch**: `01-todo-console-app`
**Created**: 2025-12-24
**Status**: Draft
**Input**: User description: "Todo In-Memory Console App"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Add Task (Priority: P1)

As a user, I can add a new task so that I can remember what to do.

**Why this priority**: Core functionality; without tasks, other features are useless.

**Independent Test**: Can be fully tested by adding a task and verifying the system acknowledges creation.

**Acceptance Scenarios**:

1. **Given** the application is running, **When** I choose to "Add Task" and provide a Title "Buy Milk", **Then** the system confirms "Task added" and assigns a unique ID.
2. **Given** adding a task, **When** I provide a Title "Study" and Description "Read Chapter 1", **Then** the task is created with both fields.
3. **Given** adding a task, **When** I try to provide an empty Title, **Then** the system prompts again or shows an error (Title is required).

---

### User Story 2 - View Tasks (Priority: P1)

As a user, I can view all tasks so that I can see my pending work.

**Why this priority**: Essential to verify added tasks and track work.

**Independent Test**: Can be tested by adding tasks (setup) and asserting the "View" output matches the input.

**Acceptance Scenarios**:

1. **Given** no tasks have been added, **When** I choose "View Tasks", **Then** the system displays "No tasks found".
2. **Given** tasks exist (ID: 1, Title: "Buy Milk", Completed: False), **When** I choose "View Tasks", **Then** the system displays "[ ] 1. Buy Milk".
3. **Given** a completed task exists, **When** I view tasks, **Then** it displays with a completed indicator (e.g., "[x]").

---

### User Story 3 - Mark Task as Complete (Priority: P2)

As a user, I can mark a task as complete so that I can track my progress.

**Why this priority**: Key value proposition of a Todo list (tracking completion).

**Independent Test**: Add a task, toggle its status, verify the status update via View.

**Acceptance Scenarios**:

1. **Given** an incomplete task (ID: 1), **When** I select "Mark Complete" for ID 1, **Then** the task status changes to True (Completed).
2. **Given** a completed task (ID: 1), **When** I select "Mark Complete" for ID 1, **Then** the task status changes to False (Incomplete) - *Assuming toggle behavior based on "Mark as Complete" usually implying one way, but "Toggle" mentioned in input*. *Decision: Input says "User toggles status by ID".*
3. **Given** I enter a non-existent ID, **Then** the system displays an error message gracefully.

---

### User Story 4 - Update Task Details (Priority: P2)

As a user, I can update a task's details so that I can correct mistakes.

**Why this priority**: Important for data accuracy but less critical than creating/completing.

**Independent Test**: Add task, modify it, verify new details.

**Acceptance Scenarios**:

1. **Given** a task (ID: 1, Title: "Buy Milk"), **When** I update ID 1 with new Title "Buy Almond Milk", **Then** the title is updated.
2. **Given** a task, **When** I update and leave the Title input blank, **Then** the existing Title is preserved.
3. **Given** I enter a non-existent ID to update, **Then** the system displays an error.

---

### User Story 5 - Delete Task (Priority: P3)

As a user, I can delete a task so that I can remove unwanted items.

**Why this priority**: Cleanup function; app is usable without it (just ignore old tasks).

**Independent Test**: Add task, delete it, verify it is no longer in the list.

**Acceptance Scenarios**:

1. **Given** a task (ID: 1) exists, **When** I delete ID 1, **Then** the system removes it from the list.
2. **Given** I try to delete ID 99 (non-existent), **Then** the system displays an error message gracefully.

### Edge Cases

- What happens when the user enters non-integer input for ID? (System must handle gracefully)
- What happens when the user enters an empty string for a required field (Title)? (System must reject or reprompt)
- What happens when the ID counter overflows? (Not a concern for in-memory/Phase 1 scope)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow creating a Task with a required Title and optional Description.
- **FR-002**: System MUST assign a unique Integer ID to each new Task.
- **FR-003**: System MUST initialize new tasks as "Incomplete" (False).
- **FR-004**: System MUST display all tasks showing ID, Status (visual indicator), Title, and Description.
- **FR-005**: System MUST allow updating Title and/or Description of an existing task by ID, preserving existing values if input is blank.
- **FR-006**: System MUST allow toggling the completion status of a task by ID.
- **FR-007**: System MUST allow deleting a task by ID.
- **FR-008**: System MUST validate numeric inputs (IDs) and prevent crashes on invalid types (strings, symbols).
- **FR-009**: System MUST operate entirely in-memory (RAM); data is transient and lost on exit.

### Key Entities

- **Task**:
  - `id`: Integer (Unique, Auto-generated)
  - `title`: String (Required)
  - `description`: String (Optional)
  - `completed`: Boolean (Default: False)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the 5 required operations (Add, View, Update, Delete, Mark) function correctly.
- **SC-002**: System handles 10 consecutive invalid inputs (e.g., "abc" for ID) without crashing (Zero crashes).
- **SC-003**: Users can successfully add a task in under 15 seconds.
- **SC-004**: Task list view clearly distinguishes between Completed and Incomplete tasks (visual verification).
