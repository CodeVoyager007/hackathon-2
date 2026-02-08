# Feature Specification: Phase 5 - Distributed Event-Driven Architecture

**Feature Branch**: `005-phase-5-distributed`
**Created**: 2026-02-08
**Status**: Draft
**Input**: Advanced Cloud Deployment with Event-Driven Architecture on Azure/GCP/Oracle.

## User Scenarios & Testing

### User Story 1 - Advanced Task Management (Priority: P1)

As a user, I can manage tasks with priorities, tags, and due dates so that I can organize my work effectively.

**Why this priority**: Core functionality for a "pro" todo app; prerequisite for sorting and filtering.

**Independent Test**: Verify creating a task with priority "High", tag "Work", and due date "Tomorrow" persists and displays correctly.

**Acceptance Scenarios**:
1. **Given** a new task input, **When** I select "High" priority, **Then** the task saves with high priority and displays a red badge.
2. **Given** a task, **When** I add tags "Work" and "Urgent", **Then** the task displays both tags.
3. **Given** a task, **When** I set a due date for tomorrow 3 PM, **Then** the task displays the due date in my local timezone.
4. **Given** a chatbot, **When** I say "Remind me to call Mom tomorrow at 5pm", **Then** a task is created with the correct due date and title.

### User Story 2 - Task Organization & Discovery (Priority: P1)

As a user, I can search, filter, and sort my tasks to find what I need quickly.

**Why this priority**: Essential for usability as the task list grows.

**Independent Test**: Create tasks with different attributes, then verify filters and sorts return the expected subsets.

**Acceptance Scenarios**:
1. **Given** a list of tasks, **When** I search for "meeting", **Then** only tasks with "meeting" in the title or description appear.
2. **Given** tasks with different priorities, **When** I filter by "High Priority", **Then** only high priority tasks are shown.
3. **Given** tasks with due dates, **When** I sort by "Due Date", **Then** tasks are ordered from soonest to latest.
4. **Given** a chatbot, **When** I ask "Show me urgent work tasks", **Then** it filters by tag "work" and priority "high" (or tag "urgent").

### User Story 3 - Recurring Tasks (Priority: P2)

As a user, I can create tasks that repeat automatically so I don't have to manually recreate them.

**Why this priority**: High-value automation feature for retention.

**Independent Test**: Create a daily recurring task, complete it, and verify a new instance is created for the next day.

**Acceptance Scenarios**:
1. **Given** a task, **When** I set recurrence to "Daily", **Then** the task is marked as recurring.
2. **Given** a daily recurring task, **When** I mark it as complete, **Then** the current task is completed AND a new task is created for tomorrow.
3. **Given** a chatbot, **When** I say "Remind me to pay rent every month", **Then** a monthly recurring task is created.

### User Story 4 - Smart Reminders (Priority: P2)

As a user, I receive timely notifications for my tasks so I don't miss deadlines.

**Why this priority**: Critical engagement feature.

**Independent Test**: Set a reminder for 1 minute from now and verify a browser notification is received.

**Acceptance Scenarios**:
1. **Given** a task with a due date, **When** the due time arrives, **Then** I receive a browser push notification (if the app is open).
2. **Given** a reminder notification, **When** I click "Snooze", **Then** the reminder is rescheduled (e.g., 15 mins later).
3. **Given** a task, **When** I set a reminder for "1 hour before", **Then** the system schedules a notification for `due_date - 1 hour`.

### User Story 5 - Event-Driven Reliability (Priority: P1 - Technical)

As a developer, I ensure all task operations publish events to Kafka so that the system is decoupled and reliable.

**Why this priority**: Foundation for the distributed architecture (Notification and Recurring services depend on this).

**Independent Test**: Verify that creating a task produces a valid JSON message to the `task-events` Kafka topic.

**Acceptance Scenarios**:
1. **Given** a Backend Service, **When** a task is created/updated/deleted, **Then** a corresponding event is published to `task-events`.
2. **Given** Dapr is configured, **When** an event is published, **Then** it uses the Dapr Pub/Sub API, not the Kafka SDK directly.
3. **Given** a high volume of requests, **Then** event publishing is asynchronous and non-blocking.

### User Story 6 - Distributed Event Consumption (Priority: P2 - Technical)

As a developer, I ensure microservices consume events via Dapr so that they can react to system changes independently.

**Why this priority**: Enables the microservices to function without tight coupling.

**Independent Test**: Publish a `task.completed` event manually and verify the Recurring Task Service processes it.

**Acceptance Scenarios**:
1. **Given** the Recurring Task Service, **When** a `task.completed` event arrives, **Then** it calculates the next occurrence and calls the backend to create it.
2. **Given** the Notification Service, **When** a reminder job triggers, **Then** it sends a notification to the user.
3. **Given** a service crash, **When** it restarts, **Then** it resumes event consumption without data loss (idempotent processing).

### User Story 7 - Cloud-Native Deployment (Priority: P3 - Technical)

As a developer, I deploy the system to Kubernetes (AKS/GKE/OKE) using Helm and CI/CD so that it runs in a production-grade environment.

**Why this priority**: Final delivery goal of Phase 5.

**Independent Test**: Trigger a GitHub Action and verify a successful rollout to the Kubernetes cluster.

**Acceptance Scenarios**:
1. **Given** a commit to main, **When** the CI/CD pipeline runs, **Then** it builds images, updates Helm charts, and deploys to the configured cluster.
2. **Given** the deployed environment, **When** I access the frontend LoadBalancer IP, **Then** the application loads successfully.
3. **Given** the cluster, **When** I check pods, **Then** all services (frontend, backend, notification, recurring) are running with Dapr sidecars.

### Edge Cases

- **Kafka Downtime**: If the message broker is unreachable, the Backend should return a 503 or queue locally (Dapr Outbox pattern recommended).
- **Duplicate Events**: Services must handle the same event ID twice without side effects (Idempotency).
- **Timezone Changes**: Recurring tasks must respect the user's original timezone even if the server is UTC.
- **Job Failure**: If a reminder job fails to trigger (Dapr sidecar issue), it should retry or be logged.

## Requirements

### Functional Requirements

- **FR-001**: System MUST support task priorities (High, Medium, Low) and persistence.
- **FR-002**: System MUST support arbitrary string tags for tasks.
- **FR-003**: System MUST provide search by keyword for task title and description.
- **FR-004**: System MUST allow filtering by status, priority, and tags (AND logic).
- **FR-005**: System MUST allow sorting by Created Date, Due Date, Priority, and Title.
- **FR-006**: System MUST persist due dates with timezone awareness.
- **FR-007**: System MUST send browser push notifications for due tasks.
- **FR-008**: System MUST support recurrence patterns (Daily, Weekly, Monthly, Yearly).
- **FR-009**: System MUST automatically create the next instance of a recurring task upon completion.
- **FR-010**: System MUST publish `task.created`, `task.updated`, `task.completed`, `task.deleted` events to Kafka via Dapr.
- **FR-011**: System MUST consume events via Dapr Pub/Sub in microservices (Notification, Recurring).
- **FR-012**: System MUST use Dapr Jobs API for scheduling exact-time reminders.

### Key Entities

- **Task**: Enhanced with `priority`, `tags`, `due_date`, `recurrence` (pattern).
- **Reminder**: Links a `task_id` to a `remind_at` timestamp and `job_name`.
- **Event**: Immutable record of a state change (`event_id`, `event_type`, `payload`, `timestamp`).

## Success Criteria

### Measurable Outcomes

- **SC-001**: 100% of created/updated tasks produce a valid event in Kafka within 500ms.
- **SC-002**: Recurring tasks generated within 5 seconds of parent task completion.
- **SC-003**: Reminder notifications delivered within 1 minute of scheduled time.
- **SC-004**: CI/CD pipeline deploys valid code to Kubernetes in under 15 minutes.
- **SC-005**: System recovers from a single pod failure (Backend or Microservice) with zero data loss.
- **SC-006**: 100% of inter-service communication is traced via Dapr (observable in Zipkin/Jaeger).
