# Implementation Plan: Todo AI Chatbot (Phase III)

**Branch**: `002-ai-chatbot` | **Date**: 2025-12-29 | **Spec**: [specs/002-ai-chatbot/spec.md]
**Input**: Phase III Specification Document

## Summary
Implement a conversational AI interface for the Todo application using the OpenAI Agents SDK and a stateless MCP server architecture. The system will allow natural language task management (CRUD) while persisting all conversation and task state in a Neon PostgreSQL database.

## Technical Context
- **AI Logic**: OpenAI Agents SDK (configured for Gemini API).
- **MCP Protocol**: Official MCP SDK (Python) using `fastmcp`.
- **Backend**: FastAPI (Python 3.12), SQLModel (ORM).
- **Frontend**: OpenAI ChatKit (Vercel AI SDK compatible).
- **Database**: Neon Serverless PostgreSQL.
- **Statelessness**: No in-memory state; rehydrate history from DB per request.

## Constitution Check
- **Spec-First**: ✅ Strictly following provided Phase III spec.
- **Stateless Architecture**: ✅ Mandatory DB persistence for all turns.
- **AI-First**: ✅ All task mutations go through MCP tools.
- **Security**: ✅ `user_id` validation in all tools and API.

## Project Structure

### Documentation
```text
specs/002-ai-chatbot/
├── spec.md              # Strict Phase III requirements
├── plan.md              # This file
├── tasks.md             # Granular SDD tasks
└── contracts/
    └── openapi.yaml     # Chat API definition
```

### Source Code
```text
backend/
├── src/
│   ├── models/
│   │   ├── chat.py          # Conversation, Message models
│   │   └── task.py          # Existing Task model
│   ├── services/
│   │   ├── chat_service.py  # Agent + Runner logic
│   │   └── tools.py         # MCP Tools (Task Ops)
│   └── api/
│       └── routes/
│           └── chat.py      # Stateless POST /api/{user_id}/chat
└── tests/
    └── api/
        └── test_chat.py     # Integration tests
```

## Design Decisions

### 1. Stateless Conversation Flow
Each request to `/chat` will:
1. Load `Message` history for the `conversation_id`.
2. Inject `system` instructions.
3. Pass history + new message to `OpenAI` client.
4. Execute tools (via `TaskTools`) when requested by Agent.
5. Save new messages to DB.
6. Return response.

### 2. MCP Tool Integration
Tools defined in `tools.py` will use `@mcp.tool()` (via `fastmcp`) to expose capabilities. The `ChatService` will act as the "MCP Client" (internal invocation) or the Agent will directly map to these tool functions.

### 3. User Isolation
Every MCP tool and the chat endpoint requires `user_id`. Tools query the DB with `where owner_id == user_id` to prevent data leakage.
