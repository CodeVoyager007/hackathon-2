# Data Model: Voice Input

## Entities

### VoiceCommand

Represents the processed result of a user's spoken instruction. This is transient data used to perform an action, not necessarily persisted long-term (except potentially in an audit log if enabled).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `raw_transcript` | `string` | Yes | The text captured by STT. |
| `intent` | `enum` | Yes | `CREATE_TASK`, `UPDATE_TASK`, `QUERY_TASK`, `DELETE_TASK`, `UNKNOWN`. |
| `entities` | `VoiceEntities` | Yes | Structured data extracted from speech. |
| `confidence` | `float` | Yes | Model confidence score (0.0 - 1.0). |

### VoiceEntities

Structured entities extracted from the natural language.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `string` | No | Task title (for Create/Update). |
| `date` | `string` | No | ISO date or relative date (e.g., "2025-01-01"). |
| `priority` | `enum` | No | `low`, `medium`, `high`, `urgent`. |
| `target_task_id` | `string` | No | ID of task to update/delete (if context aware). |
| `search_query` | `string` | No | Text for search intent. |

### VoiceResponse

The system's reply to the frontend.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `success` | `boolean` | Yes | Whether the operation succeeded. |
| `message` | `string` | Yes | Spoken response text (TTS input). |
| `action_taken` | `string` | No | Description of action (e.g., "Created task 'Buy Milk'"). |
| `data` | `object` | No | Result data (e.g., list of tasks found). |
| `requires_confirmation` | `boolean` | No | If true, frontend should prompt user (e.g., for Delete). |

## Enum Definitions

### VoiceIntent
- `CREATE_TASK`
- `UPDATE_TASK`
- `QUERY_TASK`
- `DELETE_TASK`
- `UNKNOWN`
