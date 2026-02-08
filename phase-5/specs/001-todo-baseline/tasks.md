---
description: "Task list for Todo App Baseline"
---

# Tasks: Todo App Baseline

**Input**: Design documents from `/specs/001-todo-baseline/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are NOT included as they were not explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create backend structure: src/api, src/core, src/models in backend/
- [ ] T002 Initialize FastAPI app with CORS and basic health check in backend/src/main.py
- [ ] T003 [P] Configure environment variables for DB and JWT in backend/.env.example
- [ ] T004 [P] Initialize Next.js project structure in frontend/ (if not already present)
- [ ] T005 [P] Setup Shadcn UI and Tailwind CSS in frontend/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T006 Setup SQLModel database connection and session in backend/src/core/db.py
- [X] T007 Implement authentication middleware (JWT verify) in backend/src/core/security.py
- [X] T008 [P] Define User model (SQLModel) in backend/src/models/user.py
- [X] T009 [P] Define shared Pydantic schemas for API responses in backend/src/schemas/common.py
- [X] T010 Setup API router structure in backend/src/api/main.py

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Authentication (Priority: P1)

**Goal**: Users can sign up, login, and maintain a session.

**Independent Test**:
- Can create a new account via UI/API.
- Can login and receive a valid JWT.
- Can access a protected `/api/health-auth` endpoint with the token.

### Implementation for User Story 1

- [X] T011 [US1] Create dependency to extract current user from JWT in backend/src/api/deps.py
- [X] T012 [US1] Create protected health check endpoint in backend/src/api/routes/health.py
- [X] T013 [P] [US1] Configure Better Auth client in frontend/src/lib/auth.ts
- [X] T014 [US1] Build Login/Signup page UI in frontend/src/app/login/page.tsx
- [X] T015 [US1] Implement auth state provider/hook in frontend/src/components/auth-provider.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Task CRUD (Priority: P1)

**Goal**: Users can create, read, update, and delete their own tasks.

**Independent Test**:
- Create a task -> appears in list.
- Update task -> change persists.
- Delete task -> disappears from list.

### Implementation for User Story 2

- [X] T016 [US2] Define Task model with foreign key to User in backend/src/models/task.py
- [X] T017 [US2] Create Task CRUD schemas (Create, Read, Update) in backend/src/schemas/task.py
- [X] T018 [US2] Implement CRUD service methods in backend/src/services/task_service.py
- [X] T019 [US2] Implement API endpoints (POST, GET, PUT, DELETE) in backend/src/api/routes/tasks.py
- [X] T020 [P] [US2] Create API client functions for Tasks in frontend/src/lib/api.ts
- [X] T021 [US2] Build Task List component in frontend/src/components/task-list.tsx
- [X] T022 [US2] Build Task Creation form in frontend/src/components/create-task-form.tsx
- [X] T023 [US2] Integrate components into Dashboard page in frontend/src/app/dashboard/page.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Task Completion (Priority: P2)

**Goal**: Users can toggle task completion status.

**Independent Test**: Toggle status updates the boolean field in DB.

### Implementation for User Story 3

- [X] T024 [US3] Update backend route to handle partial updates (PATCH) in backend/src/api/routes/tasks.py
- [X] T025 [P] [US3] Add toggle function to API client in frontend/src/lib/api.ts
- [X] T026 [US3] Add checkbox UI and toggle handler in frontend/src/components/task-item.tsx

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - Data Isolation (Priority: P1)

**Goal**: Ensure strict data isolation between users.

**Independent Test**: Attempt to access User A's task ID using User B's token -> returns 404 or 403.

### Implementation for User Story 4

- [X] T027 [US4] Verify `owner_id` filter in all task service queries in backend/src/services/task_service.py
- [X] T028 [US4] Add 404/403 exception handling for non-owned resources in backend/src/api/routes/tasks.py
- [X] T029 [US4] Manual verification script/test to attempt cross-user access in tests/manual_isolation_check.py

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T030 Update API documentation (Swagger UI default)
- [X] T031 Refactor frontend layout for responsiveness in frontend/src/app/layout.tsx
- [X] T032 Verify database migration scripts (alembic) in backend/alembic/
- [X] T033 Final end-to-end manual walkthrough of all features

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (Auth)**: Can start after Foundational
- **User Story 2 (Task CRUD)**: Depends on US1 (Auth) for `current_user` dependency
- **User Story 3 (Completion)**: Extends US2
- **User Story 4 (Isolation)**: Validates US2

### Implementation Strategy

### MVP First

1. Complete Phase 1 & 2 (Foundation)
2. Complete Phase 3 (Auth) -> Verify Login
3. Complete Phase 4 (CRUD) -> Verify Task Management
4. Complete Phase 6 (Isolation) -> Verify Security
5. Add Phase 5 (Completion) -> Enhancements

