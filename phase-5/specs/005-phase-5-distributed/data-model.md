# Data Model: Phase 5 - Distributed Event-Driven Architecture

**Branch**: `005-phase-5-distributed`
**Date**: 2026-02-08

## Entities

### Task (Updated)

Extends the existing Task model.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| id | Integer | Yes | Auto | Primary Key |
| title | String | Yes | - | Task title |
| description | String | No | null | Task details |
| completed | Boolean | Yes | false | Completion status |
| user_id | String | Yes | - | Owner ID |
| **priority** | Enum | Yes | "medium" | "high", "medium", "low" |
| **tags** | List[String] | Yes | [] | JSON/Array column for tags |
| **due_date** | DateTime | No | null | UTC Timestamp |
| **recurrence** | JSON | No | null | `{"pattern": "daily", "interval": 1}` |
| created_at | DateTime | Yes | Now | Creation time |
| updated_at | DateTime | Yes | Now | Update time |

### Reminder (New)

Tracks scheduled notifications.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| id | Integer | Yes | Auto | Primary Key |
| user_id | String | Yes | - | Owner ID |
| task_id | Integer | Yes | - | Foreign Key to Task |
| due_at | DateTime | Yes | - | When the task is due (UTC) |
| remind_at | DateTime | Yes | - | When to notify (e.g. 1hr before) (UTC) |
| sent | Boolean | Yes | false | Delivery status |
| job_name | String | Yes | - | Dapr Job ID (for cancellation) |

### Event (Audit - Optional)

Immutable log of system events.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| id | Integer | Yes | Auto | Primary Key |
| event_id | UUID | Yes | - | Unique Event ID |
| event_type | String | Yes | - | `task.created`, `task.completed`, etc. |
| user_id | String | Yes | - | Actor |
| task_id | Integer | No | - | Related Entity |
| payload | JSON | Yes | - | Full event data snapshot |
| created_at | DateTime | Yes | Now | Timestamp |

## API Contracts (Backend Service)

### Tasks API (Updates)

- **GET /tasks**
  - Query Params: `priority` (enum), `tags` (list), `search` (string), `sort_by` (enum)
  - Response: List[Task]

- **POST /tasks**
  - Body: TaskCreate (includes `priority`, `tags`, `due_date`, `recurrence`)
  - Response: Task

- **PATCH /tasks/{id}**
  - Body: TaskUpdate (includes new fields)
  - Side Effect: Publishes `task.updated`, Reschedules/Cancels Reminder Job

- **DELETE /tasks/{id}**
  - Side Effect: Publishes `task.deleted`, Cancels Reminder Job

### Reminders API (Internal/Admin)

- **POST /reminders/callback** (Webhoook for Dapr)
  - Body: JobPayload
  - Action: Triggers Notification Service

## Event Schemas (Kafka/Dapr)

### Topic: `task-events`

**Event Types**: `task.created`, `task.updated`, `task.completed`, `task.deleted`

```json
{
  "specversion": "1.0",
  "type": "task.created",
  "source": "backend-service",
  "id": "uuid-1234",
  "time": "2026-02-08T10:00:00Z",
  "datacontenttype": "application/json",
  "data": {
    "user_id": "user_123",
    "task_id": 456,
    "current_state": {
      "title": "Buy Milk",
      "priority": "high",
      "tags": ["home"],
      "recurrence": { "pattern": "weekly" }
    }
  }
}
```

### Topic: `reminders`

**Event Types**: `reminder.scheduled`, `reminder.triggered`

```json
{
  "specversion": "1.0",
  "type": "reminder.triggered",
  "source": "notification-service",
  "id": "uuid-5678",
  "time": "2026-02-08T15:00:00Z",
  "datacontenttype": "application/json",
  "data": {
    "user_id": "user_123",
    "task_id": 456,
    "title": "Buy Milk",
    "message": "Task 'Buy Milk' is due in 1 hour."
  }
}
```
