---
description: "Strict SDD Task List for Todo AI Chatbot (Phase III)"
---

# Tasks: Todo AI Chatbot

**Input**: Strict Phase III Specification and Plan
**Prerequisites**: spec.md, plan.md, data-model.md

## Phase 1: Foundational (Blocking)

- [X] T001 Install dependencies (openai, fastmcp, pydantic-settings) in backend/pyproject.toml
- [X] T002 Configure environment (GEMINI_API_KEY, BETTER_AUTH_URL) in backend/.env
- [X] T003 Create Conversation and Message models in backend/src/models/chat.py
- [X] T004 Register chat models in backend/src/models/__init__.py
- [X] T005 Initialize database tables for chat in backend/src/main.py (via init_db)

## Phase 2: MCP Tools (Task Operations)

- [X] T006 Implement add_task tool with user_id in backend/src/services/tools.py
- [X] T007 Implement list_tasks tool with status filter in backend/src/services/tools.py
- [X] T008 Implement complete_task tool with user_id in backend/src/services/tools.py
- [X] T009 Implement delete_task tool with user_id in backend/src/services/tools.py
- [X] T010 Implement update_task tool with user_id in backend/src/services/tools.py
- [X] T011 [P] Verify tool isolation (owner_id checks) in tools.py

## Phase 3: Backend API & AI Logic

- [X] T012 Implement conversation history hydration in backend/src/services/chat_service.py
- [X] T013 Implement user message persistence in backend/src/services/chat_service.py
- [X] T014 Implement OpenAI Agent loop with tool execution in backend/src/services/chat_service.py
- [X] T015 Implement assistant response persistence in backend/src/services/chat_service.py
- [X] T016 Implement POST /api/{user_id}/chat endpoint in backend/src/api/routes/chat.py
- [X] T017 [P] Register chat router in backend/src/api/main.py

## Phase 4: Frontend UI (ChatKit)

- [X] T018 Install frontend dependencies (ai SDK) in frontend/package.json
- [X] T019 Implement chat API client in frontend/src/lib/chat-api.ts
- [X] T020 Implement ChatWindow UI component in frontend/src/components/chat/chat-window.tsx
- [X] T021 Implement Chat page in frontend/src/app/chat/page.tsx
- [X] T022 Add Chat link to navbar in frontend/src/components/navbar.tsx

## Phase 5: Verification & Polish

- [X] T023 Create integration test for chat task creation in backend/tests/api/test_chat_tasks.py
- [ ] T024 Verify statelessness (no in-memory history) via service audit
- [ ] T025 Verify natural language commands mapping (e.g. "remember to pay bills" -> add_task)
- [ ] T026 Final security audit of user_id ownership in all chat paths