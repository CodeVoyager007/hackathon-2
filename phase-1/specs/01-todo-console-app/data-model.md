# Data Model: Todo Console App

## Entities

### Task
Represents a single todo item.

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | Integer | Yes | Auto-gen | Unique identifier (1, 2, 3...) |
| `title` | String | Yes | - | Short summary of the task |
| `description` | String | No | "" | Detailed info (optional) |
| `completed` | Boolean | Yes | False | Completion status |

## Persistence Schema (In-Memory)

The application state will be held in a Service class instance:

```python
class TaskRepository:
    _tasks: Dict[int, Task] = {}
    _next_id: int = 1
```

## Relationships

- None (Single entity system).

## Validation Rules

1. **Title**: Must be a non-empty string (trimmed).
2. **ID**: Must be a positive integer.
3. **Completed**: Boolean only.
