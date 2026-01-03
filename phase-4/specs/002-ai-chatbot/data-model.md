# Data Model: Todo AI Chatbot

## Entities

### Task (Existing + Updates)
*Reflects the Todo Item managed by the user.*

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary Key |
| user_id | UUID | Yes | Foreign Key to User (Owner) |
| title | String | Yes | Task summary |
| description | String | No | Detailed info |
| completed | Boolean | Yes | Default: false |
| created_at | DateTime | Yes | Timestamp |
| updated_at | DateTime | Yes | Timestamp |

### Conversation
*Represents a continuous dialogue thread between a user and the AI.*

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary Key |
| user_id | UUID | Yes | Foreign Key to User (Owner) |
| created_at | DateTime | Yes | Start of conversation |
| updated_at | DateTime | Yes | Last activity timestamp |

### Message
*Represents a single atomic message within a conversation.*

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | Yes | Primary Key |
| conversation_id | UUID | Yes | Foreign Key to Conversation |
| role | Enum | Yes | `user` or `assistant` (or `system` / `tool`) |
| content | Text | Yes | The actual text content |
| created_at | DateTime | Yes | Message timestamp |

## Relationships

- **User** 1:N **Task**
- **User** 1:N **Conversation**
- **Conversation** 1:N **Message**

## Database Constraints

- `Task.user_id` indexed for fast lookup.
- `Message.conversation_id` indexed for history retrieval.
- `Message.created_at` indexed for sorting history.
