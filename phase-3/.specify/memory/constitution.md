<!--
Sync Impact Report:
- Version change: 1.1.0 -> 1.2.0
- List of modified principles:
  - Added: II. Legacy Preservation
  - Added: IV. AI-First Interaction
  - Added: V. Stateless Architecture
  - Renumbered: [Gemini-Only Coding] -> III
  - Renumbered: [Strict Separation of Concerns] -> VI
  - Renumbered: [Security First] -> VII
  - Renumbered: [Monorepo Architecture] -> VIII
- Added sections:
  - Tech Stack Laws (Updated for AI)
- Templates requiring updates:
  - None (✅ updated)
- Follow-up TODOs: None
-->
# AI-Powered Conversational Todo Application Constitution

## Core Principles

### I. Spec-First Development
**Spec-first development is mandatory.** No implementation code may be written before a specification and plan have been approved. This ensures clarity, reduces churn, and guarantees that all features are intentional and well-designed.

### II. Legacy Preservation
**Phase-2 functionality must remain intact.** The existing frontend, backend, authentication, and database code is preserved and reused. New features extend rather than replace the foundational architecture, ensuring stability while adding capabilities.

### III. Gemini-Only Coding
**Gemini is the only entity allowed to write code.** This maintains a unified coding style, ensures all changes are tracked through the agent's context, and prevents human-introduced errors or style inconsistencies that bypass the spec process.

### IV. AI-First Interaction
**Conversational interface replaces GUI task interactions.** The primary mode of interaction for task management is natural language. All AI behavior must be tool-driven via the Model Context Protocol (MCP), ensuring deterministic and safe execution of user intents.

### V. Stateless Architecture
**Server must be stateless.** All conversation and task state must be persisted in the database (Neon PostgreSQL). No in-memory state retention across requests is permitted, ensuring scalability and reliability.

### VI. Strict Separation of Concerns
**Frontend and backend responsibilities remain strictly separated.** The backend provides a secure REST API; the frontend consumes it. No direct database access from the frontend. This ensures scalability, security, and independent deployability.

### VII. Security First
**Authentication and authorization enforced on every request.** All API endpoints (except public auth/health checks) must require valid authentication. Data isolation between users is mandatory; users must never see another user's data.

### VIII. Monorepo Architecture
**Monorepo structure using Spec-Kit Plus.** The project uses a single repository to house both frontend and backend code, managed with unified tooling where appropriate, while maintaining the logical separation defined in Principle VI.

## Tech Stack Laws

**Frontend:**
*   **Framework:** Next.js 16+ (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS, shadcn/ui
*   **AI UI:** OpenAI ChatKit UI
*   **Package Manager:** npm

**Backend:**
*   **Framework:** FastAPI (Python)
*   **ORM:** SQLModel
*   **AI SDK:** OpenAI Agents SDK (configured for Gemini API)
*   **Tools:** Official MCP SDK
*   **Package Manager:** uv

**Infrastructure:**
*   **Database:** Neon Serverless PostgreSQL
*   **Authentication:** Better Auth with JWT
*   **Model Provider:** Gemini API (via OpenAI SDK base_url)

## Development Workflow

1.  **Spec:** Define the feature in a `spec.md` file (User Stories, Requirements).
2.  **Plan:** Create a technical `plan.md` (Architecture, Data Models, API Contracts).
3.  **Tasks:** Break down the plan into atomic `tasks.md` (Implementation steps).
4.  **Execute:** Implement tasks sequentially or in parallel, verifying each step.
5.  **Verify:** Ensure multi-user isolation and end-to-end authentication works.

## Governance

**Constitution supersedes all other practices.** Amendments require documentation and approval.

**Version**: 1.2.0 | **Ratified**: 2025-12-25 | **Last Amended**: 2025-12-29