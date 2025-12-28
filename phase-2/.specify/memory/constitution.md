<!--
Sync Impact Report:
- Version change: 1.0.0 -> 1.1.0
- List of modified principles:
  - [PRINCIPLE_1_NAME] -> I. Spec-First Development
  - [PRINCIPLE_2_NAME] -> II. Gemini-Only Coding
  - [PRINCIPLE_3_NAME] -> III. Strict Separation of Concerns
  - [PRINCIPLE_4_NAME] -> IV. Security First
  - [PRINCIPLE_5_NAME] -> V. Monorepo Architecture
- Added sections:
  - Tech Stack Laws
  - Development Workflow
- Removed sections:
  - [PRINCIPLE_6_NAME] (Template placeholder)
- Templates requiring updates:
  - None (✅ updated)
- Follow-up TODOs: None
-->
# Todo Full-Stack Web Application Constitution

## Core Principles

### I. Spec-First Development
**Spec-first development is mandatory.** No implementation code may be written before a specification and plan have been approved. This ensures clarity, reduces churn, and guarantees that all features are intentional and well-designed.

### II. Gemini-Only Coding
**Gemini is the only entity allowed to write code.** This maintains a unified coding style, ensures all changes are tracked through the agent's context, and prevents human-introduced errors or style inconsistencies that bypass the spec process.

### III. Strict Separation of Concerns
**Frontend and backend responsibilities remain strictly separated.** The backend provides a secure REST API; the frontend consumes it. No direct database access from the frontend. This ensures scalability, security, and independent deployability.

### IV. Security First
**Authentication and authorization enforced on every request.** All API endpoints (except public auth/health checks) must require valid authentication. Data isolation between users is mandatory; users must never see another user's data.

### V. Monorepo Architecture
**Monorepo structure using Spec-Kit Plus.** The project uses a single repository to house both frontend and backend code, managed with unified tooling where appropriate, while maintaining the logical separation defined in Principle III.

## Tech Stack Laws

**Frontend:**
*   **Framework:** Next.js 16+ (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS, shadcn/ui
*   **Package Manager:** npm

**Backend:**
*   **Framework:** FastAPI (Python)
*   **ORM:** SQLModel
*   **Package Manager:** uv

**Infrastructure:**
*   **Database:** Neon Serverless PostgreSQL
*   **Authentication:** Better Auth with JWT

## Development Workflow

1.  **Spec:** Define the feature in a `spec.md` file (User Stories, Requirements).
2.  **Plan:** Create a technical `plan.md` (Architecture, Data Models, API Contracts).
3.  **Tasks:** Break down the plan into atomic `tasks.md` (Implementation steps).
4.  **Execute:** Implement tasks sequentially or in parallel, verifying each step.
5.  **Verify:** Ensure multi-user isolation and end-to-end authentication works.

## Governance

**Constitution supersedes all other practices.** Amendments require documentation and approval.

**Version**: 1.1.0 | **Ratified**: 2025-12-25 | **Last Amended**: 2025-12-25