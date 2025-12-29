# Quickstart: Todo AI Chatbot

## Prerequisites

- Python 3.12+
- Node.js 18+
- Gemini API Key (configured as `GEMINI_API_KEY` env var)
- Database URL (Neon PostgreSQL)

## Backend Setup

1. **Navigate to backend**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   uv sync
   ```

3. **Set environment variables**:
   Ensure `.env` contains:
   ```
   GEMINI_API_KEY=your_key_here
   DATABASE_URL=your_db_url
   ```

4. **Run the server**:
   ```bash
   uv run uvicorn src.main:app --reload
   ```

## Frontend Setup

1. **Navigate to frontend**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

## Usage

1. Open `http://localhost:3000/chat` (after logging in).
2. Type a message like "Add a task to buy milk".
3. The AI agent will process the request, call the `add_task` tool, and confirm the action.
