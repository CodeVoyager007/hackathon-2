# Research: Todo AI Chatbot

**Feature**: Todo AI Chatbot (Phase 3)
**Date**: 2025-12-29

## Technical Decisions

### AI Agent Framework
**Decision**: Use `OpenAI Agents SDK` with `Gemini` via `base_url` configuration.
**Rationale**: The user explicitly requested OpenAI Agents SDK. We can configure it to point to Google's OpenAI-compatible endpoint for Gemini (`https://generativelanguage.googleapis.com/v1beta/openai/`).
**Integration**:
- Install `openai` python package.
- Configure client with `base_url="https://generativelanguage.googleapis.com/v1beta/openai/"` and `api_key=GEMINI_API_KEY`.
- Use standard Chat Completions API which the Agents SDK wraps.

### Tooling Protocol
**Decision**: Use `fastmcp` (Official MCP SDK high-level wrapper) for defining tools.
**Rationale**: The research confirmed `fastmcp` is the standard way to expose MCP tools in FastAPI. It allows using decorators `@mcp.tool()` to easily register functions as tools that the agent can invoke.
**Integration**:
- Install `fastmcp`.
- Create an `MCP` instance wrapping the FastAPI app (or mounted as a sub-app/router).
- Define tools `add_task`, `list_tasks`, etc. using the SDK.
- The Agent will need a way to "see" these tools. Since the Agent is running *in* the same server as the tools, we can directly invoke the python functions or use the MCP protocol to inspect them. Given the "stateless" requirement, the Agent loop will likely happen within the `/chat` endpoint handler, passing the tool definitions to the LLM call.

### Frontend UI
**Decision**: Use `OpenAI ChatKit` (or a compatible shadcn/ui chat interface if official ChatKit is proprietary/unavailable as a standalone open-source component - research on "OpenAI ChatKit" returned generic "integrate OpenAI with React" results, implying "ChatKit" might be a generic term or a specific library like `@chatscope/chat-ui-kit-react` or similar. *Correction*: The user specified "OpenAI ChatKit UI". If this refers to the Vercel AI SDK's `useChat` hook and UI components (often called "AI SDK UI"), we will use that as it's the industry standard for Next.js AI chat.
**Rationale**: Vercel AI SDK (`ai` package) provides `useChat` hook which handles streaming, message state, and UI updates perfectly with Next.js App Router.
**Integration**:
- Frontend: `npm install ai`. Use `useChat({ api: '/api/chat' })`.
- Backend: Return a `StreamingResponse` (if streaming) or JSON. The prompt implies a custom `/api/{user_id}/chat`.

### Conversation Persistence
**Decision**: Custom PostgreSQL schema (`Conversation`, `Message`).
**Rationale**: We need strict ownership and history retention.
- `Conversation`: Holds the session.
- `Message`: Stores role (user/assistant) and content.
- The `/chat` endpoint will load all `Message` rows for the active `Conversation` to build the context window for the LLM.

## Architecture Pattern
1. **Request**: `POST /api/{user_id}/chat` with `{ "message": "Buy milk" }`.
2. **Auth**: Validate User ID & JWT.
3. **Context**: Fetch last N messages from DB.
4. **Agent Loop**:
   - Append new user message to history.
   - Call LLM with history + Tools definitions.
   - **If Tool Call**:
     - Execute tool (e.g., `INSERT INTO tasks...`).
     - Append tool result to history.
     - Call LLM again with updated history.
   - **If Final Response**:
     - Save new user message and assistant response to DB.
     - Return text to client.
5. **Statelessness**: No in-memory conversation buffer; everything is re-hydrated from DB per request.

## Alternatives Considered
- **LangChain**: Rejected to keep dependencies minimal and align with "OpenAI Agents SDK" request.
- **Stateful WebSocket**: Rejected due to "Stateless" constraint.
