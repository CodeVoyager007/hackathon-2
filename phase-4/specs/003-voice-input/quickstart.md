# Quickstart: Voice Input Feature

**Prerequisites**:
- Microphone enabled in browser permissions.
- Backend running with `OPENAI_API_KEY` (Gemini) configured.

## 1. Frontend Setup

The voice feature uses `react-speech-recognition`.

1.  **Install Dependencies**:
    ```bash
    cd frontend
    npm install react-speech-recognition regenerator-runtime react-audio-visualize
    ```

2.  **Enable Polyfills** (if needed):
    Import `regenerator-runtime/runtime` in your `layout.tsx` or `_app.tsx` if you encounter runtime errors.

## 2. Testing Voice Commands

### Manual Testing
1.  Navigate to the Dashboard.
2.  Click the **Microphone** icon.
3.  Speak a command:
    - "Buy milk tomorrow."
    - "What do I have today?"
    - "Mark 'Buy milk' as complete."
4.  Verify:
    - The waveform pulses while speaking.
    - The transcript appears.
    - The system speaks back a confirmation.
    - The task list updates.

## 3. Backend NLP Testing

You can test the NLP logic directly via the API docs (Swagger UI at `/docs`):

1.  **Endpoint**: `POST /api/voice/process`
2.  **Payload**:
    ```json
    {
      "transcript": "Create a high priority task to call John next Monday",
      "client_timezone": "UTC"
    }
    ```
3.  **Expected Response**:
    ```json
    {
      "success": true,
      "message": "I've added 'Call John' to your list for next Monday.",
      "action_type": "CREATE",
      "payload": {
        "title": "Call John",
        "priority": "high",
        "due_date": "2025-XX-XX..."
      }
    }
    ```
