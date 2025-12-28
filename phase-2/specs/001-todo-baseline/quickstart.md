# Quickstart: Todo App

## Prerequisites
- Node.js 18+
- Python 3.11+
- `uv` package manager
- Docker (for Neon/Postgres simulation or local DB)

## Backend Setup

1. Navigate to backend:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   uv sync
   ```
3. Set environment variables (`.env`):
   ```
   DATABASE_URL=postgresql://user:pass@localhost:5432/todo_db
   JWT_SECRET=your-super-secret-key
   ```
4. Run server:
   ```bash
   uv run fastapi dev main.py
   ```
   API available at: `http://localhost:8000`

## Frontend Setup

1. Navigate to frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set environment variables (`.env.local`):
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```
4. Run dev server:
   ```bash
   npm run dev
   ```
   UI available at: `http://localhost:3000`
