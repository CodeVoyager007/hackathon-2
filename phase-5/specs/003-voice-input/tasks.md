---
description: "Task list for Voice Input feature implementation"
---

# Tasks: Voice Input

**Input**: Design documents from `/specs/003-voice-input/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/voice-api.yaml, research.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Install frontend voice dependencies in frontend/package.json (react-speech-recognition, react-audio-visualize)
- [ ] T002 [P] Create backend voice route structure in backend/src/api/routes/voice.py
- [ ] T003 [P] Create voice service module in backend/src/services/voice_service.py
- [ ] T004 [P] Create voice schemas in backend/src/schemas/voice.py

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Define Pydantic models for VoiceCommand and VoiceResponse in backend/src/schemas/voice.py
- [ ] T006 Implement NLP service integration with Gemini API in backend/src/services/nlp_service.py
- [ ] T007 Create basic Voice Control container component in frontend/src/app/dashboard/voice-control.tsx
- [ ] T008 Implement useVoice hook wrapper in frontend/src/lib/voice-client.ts for STT management

**Checkpoint**: Foundation ready - basic STT and NLP structure in place

## Phase 3: User Story 1 - Create Task via Voice (Priority: P1) 🎯 MVP

**Goal**: Users can create tasks by speaking natural phrases

**Independent Test**: Click microphone -> Speak "Buy milk" -> Verify task creation

### Implementation for User Story 1

- [ ] T009 [US1] Create Microphone Button component with visual states in frontend/src/components/voice/microphone-btn.tsx
- [ ] T010 [US1] Implement Waveform visualization using react-audio-visualize in frontend/src/components/voice/waveform.tsx
- [ ] T011 [US1] Integrate Microphone and Waveform into Voice Control container in frontend/src/app/dashboard/voice-control.tsx
- [ ] T012 [US1] Implement backend logic to parse CREATE intent using Gemini in backend/src/services/nlp_service.py
- [ ] T013 [US1] Create API endpoint POST /api/voice/process to handle transcription and return structured task data in backend/src/api/routes/voice.py
- [ ] T014 [US1] Connect frontend Voice Control to backend API in frontend/src/lib/voice-client.ts
- [ ] T015 [US1] Implement Task Creation logic in backend/src/services/voice_service.py to persist task to DB
- [ ] T016 [US1] Add Text-to-Speech confirmation for created tasks in frontend/src/lib/voice-client.ts

**Checkpoint**: User Story 1 (MVP) fully functional - Voice to Task creation works

## Phase 4: User Story 2 - Task Query & Daily Briefing (Priority: P2)

**Goal**: Users can ask about their schedule

**Independent Test**: Speak "What do I have today?" -> Verify audio/visual response

### Implementation for User Story 2

- [ ] T017 [US2] Update NLP service to detect QUERY intent and extract date ranges in backend/src/services/nlp_service.py
- [ ] T018 [US2] Implement Task Query logic (fetch tasks by date/status) in backend/src/services/voice_service.py
- [ ] T019 [US2] Update /api/voice/process endpoint to handle QUERY responses in backend/src/api/routes/voice.py
- [ ] T020 [US2] Handle VoiceResponse payload in frontend to display/speak query results in frontend/src/app/dashboard/voice-control.tsx

**Checkpoint**: User Story 2 functional - Voice queries work

## Phase 5: User Story 3 - Task Update & Management (Priority: P2)

**Goal**: Users can update tasks via voice

**Independent Test**: Speak "Mark 'Buy milk' as complete" -> Verify task status update

### Implementation for User Story 3

- [ ] T021 [US3] Update NLP service to detect UPDATE/DELETE intents and target tasks in backend/src/services/nlp_service.py
- [ ] T022 [US3] Implement Task Update/Delete logic in backend/src/services/voice_service.py
- [ ] T023 [US3] Add confirmation flow for DELETE operations in frontend/src/lib/voice-client.ts (TTS prompt "Are you sure?")
- [ ] T024 [US3] Handle confirmation responses (Yes/No) in backend/src/api/routes/voice.py

**Checkpoint**: User Story 3 functional - CRUD operations complete

## Phase 6: User Story 4 - Voice Settings & Feedback (Priority: P3)

**Goal**: Customize voice experience

**Independent Test**: Toggle TTS off -> Verify silent operation

### Implementation for User Story 4

- [ ] T025 [US4] Create Voice Settings UI (TTS toggle) in frontend/src/app/dashboard/settings/voice-settings.tsx
- [ ] T026 [US4] Persist user voice preferences (local storage or DB) in frontend/src/lib/voice-client.ts
- [ ] T027 [US4] Create Transcript Display component in frontend/src/components/voice/transcript.tsx
- [ ] T028 [US4] Add "Did you mean..." clarification logic for ambiguous commands in backend/src/services/nlp_service.py

**Checkpoint**: User Story 4 functional - Settings and advanced feedback active

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T029 [P] Optimize NLP prompt for lower latency (<2s) in backend/src/services/nlp_service.py
- [ ] T030 Add error handling for network failures (Offline mode notification) in frontend/src/lib/voice-client.ts
- [ ] T031 Polish UI animations for listening states in frontend/src/components/voice/microphone-btn.tsx
- [ ] T032 Verify accessibility (keyboard navigation for voice button) in frontend/src/app/dashboard/voice-control.tsx

## Dependencies & Execution Order

1.  **Setup (Phase 1)** & **Foundational (Phase 2)** must complete first.
2.  **User Story 1 (Phase 3)** is the MVP. Stop here to validate core value.
3.  **User Story 2 & 3 (Phase 4 & 5)** can run in parallel if multiple devs, but sequential is safer for context sharing.
4.  **User Story 4 (Phase 6)** is non-critical enhancement.

## Parallel Execution Examples

- **Phase 3 (US1)**:
    - Backend: T012 (NLP), T013 (API), T015 (Service)
    - Frontend: T009 (Btn), T010 (Vis), T011 (Integration)
    - Can merge at T014 (Integration)

- **Phase 4 (US2)**:
    - Backend: T017 (NLP), T018 (Service)
    - Frontend: T020 (UI Response)
