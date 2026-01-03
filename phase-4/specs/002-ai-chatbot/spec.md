# Feature Specification: Todo AI Chatbot (Phase III)

**Feature Branch**: `002-ai-chatbot`
**Created**: 2025-12-29
**Status**: Revised (Strict Alignment)
**Input**: Phase III Specification Document

## Objective
Create an AI-powered chatbot interface for managing todos through natural language using MCP (Model Context Protocol) server architecture and using Claude Code and Spec-Kit Plus.

## Requirements
1. Implement conversational interface for all Basic Level features
2. Use OpenAI Agents SDK for AI logic
3. Build MCP server with Official MCP SDK that exposes task operations as tools
4. Stateless chat endpoint that persists conversation state to database
5. AI agents use MCP tools to manage tasks. The MCP tools will also be stateless and will store state in the database.

## Technology Stack
- **Frontend**: OpenAI ChatKit
- **Backend**: Python FastAPI
- **AI Framework**: OpenAI Agents SDK
- **MCP Server**: Official MCP SDK
- **ORM**: SQLModel
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth

## Architecture
```mermaid
graph LR
    User[ChatKit UI (Frontend)] -->|POST /api/chat| API[FastAPI Server]
    API -->|Fetch/Store| DB[(Neon DB PostgreSQL)]
    API <-->|Agent + Runner| Agent[OpenAI Agents SDK]
    Agent -->|Invokes| MCP[MCP Server]
    MCP -->|Task Ops| DB
```

## Database Models

### Task
- `user_id` (string): Owner
- `id` (integer/uuid): Primary Key
- `title` (string): Task title
- `description` (string): Task details
- `completed` (boolean): Status
- `created_at` (datetime): Timestamp
- `updated_at` (datetime): Timestamp

### Conversation
- `user_id` (string): Owner
- `id` (integer/uuid): Primary Key
- `created_at` (datetime): Timestamp
- `updated_at` (datetime): Timestamp

### Message
- `user_id` (string): Owner
- `id` (integer/uuid): Primary Key
- `conversation_id` (integer/uuid): Foreign Key
- `role` (string): user/assistant
- `content` (string): Message text
- `created_at` (datetime): Timestamp

## Chat API Endpoint

**POST /api/{user_id}/chat**

**Request**:
- `conversation_id` (integer/uuid, optional): Existing conversation ID
- `message` (string, required): User's natural language message

**Response**:
- `conversation_id` (integer/uuid): The conversation ID
- `response` (string): AI assistant's response
- `tool_calls` (array): List of MCP tools invoked

## MCP Tools Specification

The MCP server must expose the following tools:

### add_task
- **Purpose**: Create a new task
- **Parameters**: `user_id` (string), `title` (string), `description` (string, optional)
- **Returns**: `task_id`, `status`, `title`

### list_tasks
- **Purpose**: Retrieve tasks from the list
- **Parameters**: `status` (string, optional: "all", "pending", "completed")
- **Returns**: Array of task objects

### complete_task
- **Purpose**: Mark a task as complete
- **Parameters**: `user_id` (string), `task_id` (integer/uuid)
- **Returns**: `task_id`, `status`, `title`

### delete_task
- **Purpose**: Remove a task from the list
- **Parameters**: `user_id` (string), `task_id` (integer/uuid)
- **Returns**: `task_id`, `status`, `title`

### update_task
- **Purpose**: Modify task title or description
- **Parameters**: `user_id` (string), `task_id` (integer/uuid), `title` (string, optional), `description` (string, optional)
- **Returns**: `task_id`, `status`, `title`

## Agent Behavior Specification
- **Task Creation**: Use `add_task` when user mentions adding/creating/remembering.
- **Task Listing**: Use `list_tasks` with appropriate filter when asked to see/show/list.
- **Task Completion**: Use `complete_task` when user says done/complete/finished.
- **Task Deletion**: Use `delete_task` when user says delete/remove/cancel.
- **Task Update**: Use `update_task` when user says change/update/rename.
- **Confirmation**: Always confirm actions with friendly response.
- **Error Handling**: Gracefully handle task not found and other errors.

## Conversation Flow (Stateless Request Cycle)
1. Receive user message
2. Fetch conversation history from database
3. Build message array for agent (history + new message)
4. Store user message in database
5. Run agent with MCP tools
6. Agent invokes appropriate MCP tool(s)
7. Store assistant response in database
8. Return response to client
9. Server holds NO state (ready for next request)

## Success Criteria
- **SC-001**: Users can perform all CRUD operations via natural language.
- **SC-002**: System maintains context across turns (stateless persistence).
- **SC-003**: All AI actions are executed via strict MCP tool definitions.
- **SC-004**: Zero data leakage between users (enforced by `user_id` in all tools).
