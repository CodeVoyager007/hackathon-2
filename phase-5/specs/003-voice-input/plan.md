# Implementation Plan: Voice Input

**Branch**: `003-voice-input` | **Date**: 2025-12-31 | **Spec**: [specs/003-voice-input/spec.md](spec.md)
**Input**: Feature specification from `specs/003-voice-input/spec.md`

## Summary

The Voice Input feature enables users to manage tasks (create, query, update, delete) using natural language speech commands. This feature leverages a Push-to-Talk interface for privacy, integrates with an LLM for intent extraction, and provides audio-visual feedback.

## Technical Context

**Language/Version**: Python 3.12+ (Backend), TypeScript 5.0+ (Frontend)
**Primary Dependencies**:
- Frontend: `react-speech-recognition` (or similar Web Speech API wrapper), `shadcn/ui` components.
- Backend: `openai` (for Gemini API via compatibility layer) for NLP.
- Audio: Browser native Web Speech API (STT), Browser native SpeechSynthesis (TTS).
**Storage**: PostgreSQL (Neon) for task persistence; No persistent storage for voice recordings (transient processing only).
**Testing**: `pytest` (Backend), `jest`/`react-testing-library` (Frontend).
**Target Platform**: Modern web browsers (Chrome, Safari, Edge, Firefox) with microphone access.
**Project Type**: Web Application (Next.js + FastAPI)
**Performance Goals**: < 2s latency from end-of-speech to action execution.
**Constraints**:
- Strict "Push-to-Talk" for privacy.
- No training on user data.
- Offline degradation (limited or no functionality if API unreachable).
**Scale/Scope**: Support for all authenticated users; expected burst usage during daily planning.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Spec-First**: Is there a spec.md? (Yes)
- [x] **Legacy**: Does this preserve Phase 2 features? (Yes, additive)
- [x] **Additive UI**: Is voice additive, not replacing UI? (Yes, UI feedback mandatory)
- [x] **Privacy**: Is voice data transient & encrypted? (Yes, HTTPS + no storage)
- [x] **Performance**: Can this meet <2s latency? (Yes, using fast LLM models)
- [x] **Stateless**: Is server state avoided? (Yes, REST API)
- [x] **Separation**: Is DB access restricted to Backend? (Yes, via API)

## Project Structure

### Documentation (this feature)

```text
specs/003-voice-input/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/
│   │   └── routes/
│   │       └── voice.py       # New voice processing endpoints
│   ├── services/
│   │   ├── nlp_service.py     # Intent extraction logic
│   │   └── voice_service.py   # Voice session management
│   └── schemas/
│       └── voice.py           # Pydantic models for voice payloads
└── tests/
    └── api/
        └── test_voice.py

frontend/
├── src/
│   ├── app/
│   │   └── dashboard/
│   │       └── voice-control.tsx # Main voice interaction container
│   ├── components/
│   │   └── voice/
│   │       ├── microphone-btn.tsx
│   │       ├── transcript.tsx
│   │       └── waveform.tsx
│   └── lib/
│       └── voice-client.ts    # Frontend voice logic (STT/TTS wrapper)
└── tests/
    └── voice/
```

**Structure Decision**: Adhering to existing Monorepo structure (Frontend/Backend split).

## Research Areas (Phase 0)

1.  **Frontend STT/TTS Library**: Evaluate `react-speech-recognition` vs native `window.SpeechRecognition` and `window.speechSynthesis`. Check browser compatibility and ease of use with Next.js App Router.
2.  **Audio Visualization**: Identify a lightweight library or CSS approach for the "waveform/pulsing" indicator (FR-002) to avoid heavy canvas dependencies if possible.
3.  **LLM Prompt Strategy**: Define the prompt structure for robust intent extraction (Create vs Query vs Update) and entity parsing (dates, priorities) using Gemini API.
4.  **Error Handling UX**: Best practices for voice-specific error feedback (e.g., "I heard X, but didn't understand Y").

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |