---
description: "Task list template for feature implementation"
---

# Tasks: Todo In-Memory Console App

**Input**: Design documents from `specs/01-todo-console-app/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: The examples below include test tasks. Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per implementation plan (src/, tests/, ui/, etc.)
- [x] T002 Initialize Python project with `uv` and create virtual environment
- [x] T003 [P] Install dependencies (`rich`, `pytest`) and create requirements file
- [x] T004 [P] Configure linting and formatting tools (ruff/black) in pyproject.toml

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create `Task` entity model in `src/models/task.py`
- [x] T006 Create `ITaskService` interface/contract in `src/services/interfaces.py`
- [x] T007 Implement basic `TaskService` class (skeleton) in `src/services/task_service.py`
- [x] T008 [P] Setup `pytest` configuration and `tests/conftest.py`
- [x] T009 Create main entry point skeleton `src/main.py` with basic menu loop

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Add Task (Priority: P1)

**Goal**: As a user, I can add a new task so that I can remember what to do.

**Independent Test**: Can be fully tested by adding a task and verifying the system acknowledges creation.

### Implementation for User Story 1

- [x] T010 [P] [US1] Create unit test for `add_task` logic in `tests/unit/test_task_service.py`
- [x] T011 [US1] Implement `add_task` logic in `src/services/task_service.py`
- [x] T012 [P] [US1] Implement CLI input for adding task in `src/ui/console.py`
- [x] T013 [US1] Connect `main.py` "Add Task" menu option to UI/Service

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - View Tasks (Priority: P1)

**Goal**: As a user, I can view all tasks so that I can see my pending work.

**Independent Test**: Can be tested by adding tasks (setup) and asserting the "View" output matches the input.

### Implementation for User Story 2

- [x] T014 [P] [US2] Create unit test for `list_tasks` logic in `tests/unit/test_task_service.py`
- [x] T015 [US2] Implement `list_tasks` logic in `src/services/task_service.py`
- [x] T016 [P] [US2] Implement `rich` table display for tasks in `src/ui/console.py`
- [x] T017 [US2] Connect `main.py` "View Tasks" menu option to UI/Service

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Mark Task as Complete (Priority: P2)

**Goal**: As a user, I can mark a task as complete so that I can track my progress.

**Independent Test**: Add a task, toggle its status, verify the status update via View.

### Implementation for User Story 3

- [x] T018 [P] [US3] Create unit test for `toggle_complete` logic in `tests/unit/test_task_service.py`
- [x] T019 [US3] Implement `toggle_complete` logic in `src/services/task_service.py`
- [x] T020 [P] [US3] Implement CLI input for ID selection in `src/ui/console.py`
- [x] T021 [US3] Connect `main.py` "Mark Complete" menu option to UI/Service

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - Update Task Details (Priority: P2)

**Goal**: As a user, I can update a task's details so that I can correct mistakes.

**Independent Test**: Add task, modify it, verify new details.

### Implementation for User Story 4

- [x] T022 [P] [US4] Create unit test for `update_task` logic in `tests/unit/test_task_service.py`
- [x] T023 [US4] Implement `update_task` logic in `src/services/task_service.py`
- [x] T024 [P] [US4] Implement CLI flow for updating fields in `src/ui/console.py`
- [x] T025 [US4] Connect `main.py` "Update Task" menu option to UI/Service

---

## Phase 7: User Story 5 - Delete Task (Priority: P3)

**Goal**: As a user, I can delete a task so that I can remove unwanted items.

**Independent Test**: Add task, delete it, verify it is no longer in the list.

### Implementation for User Story 5

- [x] T026 [P] [US5] Create unit test for `delete_task` logic in `tests/unit/test_task_service.py`
- [x] T027 [US5] Implement `delete_task` logic in `src/services/task_service.py`
- [x] T028 [P] [US5] Implement CLI flow for deletion confirmation in `src/ui/console.py`
- [x] T029 [US5] Connect `main.py` "Delete Task" menu option to UI/Service

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T030 Create integration test for full user flow in `tests/integration/test_console_flow.py`
- [x] T031 Refactor error handling in `src/ui/console.py` (Graceful failure)
- [x] T032 Add module docstrings and type hints verification
- [x] T033 Verify "Quickstart" instructions work on clean environment

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### Parallel Opportunities

- **Services & UI**: Within each story, service logic and UI prompts can often be built in parallel once the interface (T006) is defined.
- **Tests**: Unit tests can be written in parallel with implementation.

---

## Implementation Strategy

### MVP First (User Story 1 + 2)

1. Complete Phase 1 & 2 (Setup & Foundation).
2. Complete Phase 3 (Add Task).
3. Complete Phase 4 (View Tasks).
4. **STOP and VALIDATE**: Verify users can Add and View tasks. This is the minimum useful app.

### Incremental Delivery

1. Add "Mark Complete" (Phase 5).
2. Add "Update" (Phase 6).
3. Add "Delete" (Phase 7).
4. Polish and Finalize.
