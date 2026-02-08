# Research: Voice Input Feature

**Date**: 2025-12-31
**Context**: Researching dependencies and strategies for the Voice Input feature in Momentum.

## 1. Frontend Speech-to-Text (STT)

**Decision**: Use `react-speech-recognition` (hook wrapper around Web Speech API).

**Rationale**:
- **Simplified API**: Provides a React-friendly hook `useSpeechRecognition` that manages listening state, transcripts, and browser support checks, significantly reducing boilerplate compared to raw `window.SpeechRecognition`.
- **Browser Compatibility**: Wraps the native API, which is supported in Chrome, Edge, Safari, and widely on mobile. It handles some cross-browser quirks.
- **Polyfill Support**: Allows for easy integration of polyfills if broader cross-browser support (e.g., Firefox desktop without flags) is needed in the future.
- **Active Community**: Well-maintained with good documentation for React/Next.js integration.

**Alternatives Considered**:
- **Native `window.SpeechRecognition`**: Too much boilerplate to manage state and lifecycle in React.
- **Cloud STT APIs (Google/AWS/OpenAI Whisper)**: Rejected for "Live" transcription due to cost and latency. We need real-time feedback (pulsing/transcript) which is best served by on-device recognition for this MVP. We can send the *final* transcript to the LLM, or if native STT fails, fallback to Whisper (future scope).

## 2. Audio Visualization

**Decision**: Use `react-audio-visualize`.

**Rationale**:
- **Lightweight**: Focuses on visualization from a media stream or blob, which fits our "recording" use case.
- **Visual Feedback**: Provides the necessary "pulsing/waveform" feedback (FR-002) to indicate the system is listening.
- **Canvas-based**: Efficient rendering.

**Alternatives Considered**:
- **`react-music-waveform`**: More focused on *playback* of music files, not real-time mic input visualization.
- **Custom Canvas implementation**: Viable, but `react-audio-visualize` provides a "good enough" component out of the box to speed up development.

## 3. Natural Language Processing (NLP)

**Decision**: Use **Gemini API** (via OpenAI SDK compatibility layer) with a system prompt optimized for structured JSON output.

**Rationale**:
- **Existing Stack**: Project already uses `openai` SDK pointing to Gemini.
- **Structured Output**: Gemini Flash 2.0 is excellent at following JSON schemas for extracting entities (Title, Date, Priority) from natural language.
- **Latency**: Flash model is fast enough for the <2s requirement.

**Alternatives Considered**:
- **Regex/Rule-based**: Too brittle for natural language (e.g., "next Friday", "urgent but not today").
- **Local LLM**: Too heavy for the browser/server for this specific scale currently; server-side Gemini is a better trade-off.

## 4. Text-to-Speech (TTS)

**Decision**: Use Native `window.speechSynthesis`.

**Rationale**:
- **Zero Latency**: No network request needed.
- **Privacy**: Text stays on device.
- **Cost**: Free.
- **Voices**: Modern browsers offer decent "natural" voices (especially on mobile/macOS).

**Alternatives Considered**:
- **ElevenLabs/OpenAI Audio**: Higher quality, but introduces latency and cost. For simple confirmations ("Task created"), native TTS is sufficient and faster.

## 5. Error Handling UX

**Decision**: "Ask for Clarification" Strategy.

**Rationale**:
- If NLP returns low confidence or missing critical fields (though defaults exist), the response should be a question: "I created the task 'Buy Milk', but when is it due?"
- If STT fails (no speech detected): "I didn't hear anything. Try again?"

## Summary of Stack Selection

- **STT**: `react-speech-recognition`
- **TTS**: Native Browser API
- **Vis**: `react-audio-visualize`
- **NLP**: Gemini Flash (Server-side)
