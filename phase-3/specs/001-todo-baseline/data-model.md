# Data Model: Todo App Baseline

## Conceptual Model

### User
Represents a registered user of the application.
- **Cardinality**: 1 User has N Tasks.

### Task
Represents a single work item.
- **Cardinality**: 1 Task belongs to 1 User.

## Schema Definitions (SQLModel)

### User Table (`users`)
Managed primarily by the Authentication Service, but referenced here for Foreign Keys.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Primary Key |
| `email` | String | Yes | Unique, Index |

### Task Table (`tasks`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Primary Key, Default: `uuid4` |
| `title` | String | Yes | Max Length: 255 |
| `is_completed` | Boolean | Yes | Default: `False` |
| `owner_id` | UUID | Yes | Foreign Key -> `users.id`, Index |
| `created_at` | DateTime | Yes | Default: `now()` |
| `updated_at` | DateTime | Yes | Default: `now()` |

## Validation Rules

1.  **Title**: Must not be empty. Max 255 chars.
2.  **Owner**: Must be a valid UUID. Cannot be null.
3.  **Isolation**: Queries for tasks MUST always include `WHERE owner_id = current_user_id`.
