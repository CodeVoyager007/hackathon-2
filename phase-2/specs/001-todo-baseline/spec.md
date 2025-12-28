# Feature Specification: Todo App Baseline

**Feature Branch**: `001-todo-baseline`
**Created**: 2025-12-25
**Status**: Draft
**Input**: User description: (See prompt history)

## User Scenarios & Testing

<!--
  Prioritized user journeys. P1 = Critical MVP.
-->

### User Story 1 - User Authentication (Priority: P1)

As a user, I want to sign up and log in so that I can securely access my private task list.

**Why this priority**: Foundation for all other features (data isolation depends on auth).

**Independent Test**:
- Can create a new account via UI/API.
- Can login and receive a valid JWT.
- Can access a protected `/api/health-auth` endpoint with the token.

**Acceptance Scenarios**:

1. **Given** a new visitor, **When** they submit valid signup details, **Then** a new account is created and they are logged in.
2. **Given** an existing user, **When** they submit valid credentials, **Then** they receive a session token.
3. **Given** an authenticated user, **When** they log out, **Then** their session is invalidated (client-side token removal).

---

### User Story 2 - Task CRUD (Priority: P1)

As a user, I want to create, view, update, and delete tasks so that I can manage my work.

**Why this priority**: Core functionality of the application.

**Independent Test**:
- Create a task -> appears in list.
- Update task -> change persists.
- Delete task -> disappears from list.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they post a new task, **Then** it is saved and returned with an ID.
2. **Given** a user with tasks, **When** they request their task list, **Then** they see all (and only) their own tasks.
3. **Given** a specific task, **When** the owner updates its title, **Then** the change is saved.
4. **Given** a specific task, **When** the owner deletes it, **Then** it is no longer retrievable.

---

### User Story 3 - Task Completion (Priority: P2)

As a user, I want to mark tasks as complete or incomplete so that I can track my progress.

**Why this priority**: Enhances the core CRUD experience.

**Independent Test**: Toggle status updates the boolean field in DB.

**Acceptance Scenarios**:

1. **Given** an incomplete task, **When** the user marks it complete, **Then** the status updates to 'done'.
2. **Given** a completed task, **When** the user unchecks it, **Then** the status updates to 'todo'.

---

### User Story 4 - Data Isolation (Priority: P1)

As a system, I must ensure users cannot access other users' data.

**Why this priority**: Security mandatory requirement.

**Independent Test**: Attempt to access User A's task ID using User B's token -> returns 404 or 403.

**Acceptance Scenarios**:

1. **Given** User A has Task 1, **When** User B requests `GET /api/tasks/{Task1_ID}`, **Then** the system returns 403 Forbidden or 404 Not Found.
2. **Given** User A has tasks, **When** User B lists tasks, **Then** User A's tasks do not appear.

## Requirements

### Functional Requirements

- **FR-001**: System MUST authenticate users via Better Auth (Frontend) and verify JWTs (Backend).
- **FR-002**: System MUST persist tasks in a PostgreSQL database using SQLModel.
- **FR-003**: API Endpoints MUST be prefixed with `/api/`.
- **FR-004**: All API operations (except auth/health) MUST require a valid JWT in the Authorization header.
- **FR-005**: `GET /api/tasks` MUST return only tasks belonging to the authenticated user.
- **FR-006**: `POST /api/tasks` MUST associate the created task with the authenticated user ID.
- **FR-007**: `PUT/PATCH/DELETE` operations on `/api/tasks/{id}` MUST fail if the task belongs to a different user.
- **FR-008**: Tasks MUST have at minimum: title, completion status, and owner ID.

### Key Entities

- **User**: Represents a registered account. Attributes: ID, Email, Password Hash (handled by auth lib).
- **Task**: Represents a todo item. Attributes: ID, Title, Is_Completed, Owner_ID (Foreign Key).

## Success Criteria

### Measurable Outcomes

- **SC-001**: Auth Roundtrip: Login to protected API call completes in < 500ms.
- **SC-002**: Security: 100% of non-owner access attempts to task resources are blocked (403/404).
- **SC-003**: Reliability: API passes 100% of contract tests for CRUD operations.
- **SC-004**: Usability: A new user can create their first task within 30 seconds of landing on the site.

## Assumptions

- "Better Auth" refers to the specific library/service integration specified in input.
- Database is Neon Serverless Postgres.
- Backend handles JWT verification using a shared secret or public key from the auth provider.