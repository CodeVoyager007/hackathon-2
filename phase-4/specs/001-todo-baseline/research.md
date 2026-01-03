# Research: Todo App Baseline

**Feature**: `001-todo-baseline`
**Status**: Complete

## Technical Decisions

### 1. Database Schema (SQLModel)
- **Decision**: Use `SQLModel` (Pydantic + SQLAlchemy) for ORM.
- **Rationale**: Mandated by Tech Stack Laws. Provides strict type safety and easy integration with FastAPI.
- **Entities**:
    - `User`: ID (UUID), Email, HashedPassword (managed by Auth lib).
    - `Task`: ID (UUID), Title, IsCompleted (bool), OwnerID (Foreign Key to User).

### 2. Authentication Integration
- **Decision**: "Better Auth" on Frontend + JWT Verification on Backend.
- **Rationale**: Mandated by spec.
- **Mechanism**:
    - Frontend: Better Auth client handles login/signup and stores JWT.
    - API Requests: Include `Authorization: Bearer <token>`.
    - Backend: Middleware validates JWT signature using shared secret/public key. Decodes `sub` (subject) claim as `user_id`.

### 3. API Structure
- **Decision**: REST API with `/api` prefix.
- **Rationale**: Standard practice, mandated by spec.
- **Endpoints**:
    - `GET /api/tasks`: List user's tasks.
    - `POST /api/tasks`: Create task (auto-assign owner).
    - `GET /api/tasks/{id}`: Get single task (verify owner).
    - `PUT /api/tasks/{id}`: Update task (verify owner).
    - `DELETE /api/tasks/{id}`: Delete task (verify owner).

### 4. Frontend State Management
- **Decision**: React Query (TanStack Query) or SWR recommended for fetching; local state for forms.
- **Rationale**: Efficient server state synchronization for task lists.

## Unknowns Resolved
- **Auth Provider Details**: Assumed generic "Better Auth" JWT flow. If a specific provider (e.g., Auth0, Supabase) was intended, it would be specified. We will proceed with a generic JWT implementation compatible with standard OIDC or custom auth servers.
- **Testing**: `pytest` for backend, `jest`/`vitest` for frontend (standard defaults).
