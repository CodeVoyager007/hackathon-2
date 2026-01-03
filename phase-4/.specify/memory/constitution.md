<!--
Sync Impact Report:
- Version change: 2.0.1 -> 2.1.0
- Rationale: Incorporated Phase-4 Cloud-Native Deployment objectives: Kubernetes orchestration, Helm charts, and AI-driven operations (AIOps).
- List of modified principles:
  - Modified: II. Legacy Preservation (Expanded to include Phase 3)
  - Added: XIII. Infrastructure as Code (IaC)
  - Added: XIV. AI-Augmented Operations
  - Added: XV. Local-First Kubernetes
  - Added: XVI. Containerization Standards
- Templates requiring updates:
  - .specify/templates/plan-template.md (Constitution Check updated)
- Follow-up TODOs: None
-->
# AI-Powered Conversational Todo Application Constitution

## Core Principles

### I. Spec-First Development
**Spec-first development is mandatory.** No implementation code may be written before a specification and plan have been approved. This ensures clarity, reduces churn, and guarantees that all features are intentional and well-designed.

### II. Legacy Preservation
**Phase-2 and Phase-3 functionality must remain intact.** The existing frontend, backend, authentication, database, and voice chatbot code is preserved and reused. New features extend rather than replace the foundational architecture, ensuring stability while adding capabilities.

### III. Gemini-Only Coding
**Gemini is the only entity allowed to write code.** This maintains a unified coding style, ensures all changes are tracked through the agent's context, and prevents human-introduced errors or style inconsistencies that bypass the spec process.

### IV. Seamless Integration (Additive UI)
**Voice is additive to existing UI, not a replacement.** Visual feedback MUST accompany all voice interactions. The system works alongside keyboard and touch interactions, ensuring users can switch modalities fluidly.

### V. Natural Language Understanding
**Users speak naturally, not in rigid commands.** The system MUST understand context, variations, and conversational patterns (e.g., "Add grocery shopping tomorrow"). Rigid syntax is forbidden.

### VI. Conversational AI Integration
**Leverage AI for intent and entity extraction.** Use AI (e.g., Gemini/OpenAI/Claude via MCP) to parse requests. The system MUST confirm ambiguous requests before executing actions to prevent errors.

### VII. Privacy & Security
**Privacy by design and default.**
*   **Voice Data:** Processed with explicit user consent. No permanent storage of raw voice recordings.
*   **Ethical Data Use:** No training on user voice data without explicit, separate opt-in.
*   **Encryption:** End-to-end encryption for voice transmission.
*   **Auth:** Authentication and authorization enforced on every request. Data isolation between users is mandatory.

### VIII. Accessibility & Inclusion
**Voice as a primary, inclusive interaction method.** It must work for users with mobility challenges or hands-free preferences. Support multi-language input (starting with English, designed for expansion).

### IX. Performance & Reliability
**Speed and stability are critical.**
*   **Latency:** <2 second response time from speech completion to action.
*   **Offline:** Works offline with cached speech recognition (degraded mode).
*   **Errors:** Graceful error handling with clear feedback.

### X. Stateless Architecture
**Server must be stateless.** All conversation and task state must be persisted in the database (Neon PostgreSQL). No in-memory state retention across requests is permitted.

### XI. Strict Separation of Concerns
**Frontend and backend responsibilities remain strictly separated.** The backend provides a secure REST API; the frontend consumes it. No direct database access from the frontend.

### XII. Monorepo Architecture
**Monorepo structure using Spec-Kit Plus.** The project uses a single repository to house both frontend and backend code, managed with unified tooling.

### XIII. Infrastructure as Code (IaC)
**All deployments MUST be defined via Helm charts.** No manual resource creation is permitted. Configuration management uses standard IaC practices to ensure reproducibility across environments.

### XIV. AI-Augmented Operations
**Utilize AI agents for operational tasks.**
*   **kubectl-ai:** For generating and applying Kubernetes manifests and debugging.
*   **kagent:** For intelligent cluster monitoring and anomaly detection.
*   **Gordon:** For Docker container management and optimization.

### XV. Local-First Kubernetes
**Development targets Minikube first.** All infrastructure and application changes must be verified locally on Minikube before any cloud deployment (e.g., DigitalOcean). This ensures a robust inner development loop.

### XVI. Containerization Standards
**Containers must be production-ready.**
*   **Health Checks:** Explicit liveness and readiness probes required.
*   **Resources:** CPU/Memory requests and limits must be defined.
*   **Security:** Non-root users where possible; minimal base images.

## Success Metrics

*   **Accuracy:** 95%+ intent recognition rate.
*   **Speed:** <2s average response time.
*   **Adoption:** 40%+ of active users try voice in first week.
*   **Satisfaction:** 4.5+ star rating for voice feature.
*   **Task Completion:** 90%+ of voice-initiated tasks successfully created.
*   **Deployment:** 100% automated deployment via Helm (0 manual steps).

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
*   **Container Engine:** Docker & Docker Compose
*   **Orchestration:** Kubernetes (Minikube Local, DigitalOcean Remote)
*   **Package Management:** Helm Charts
*   **Registry:** Docker Hub / GitHub Container Registry
*   **AIOps:** kubectl-ai, kagent, Gordon

## Development Workflow

1.  **Spec:** Define the feature in a `spec.md` file (User Stories, Requirements).
2.  **Plan:** Create a technical `plan.md` (Architecture, Data Models, API Contracts).
3.  **Tasks:** Break down the plan into atomic `tasks.md` (Implementation steps).
4.  **Execute:** Implement tasks sequentially or in parallel, verifying each step.
5.  **Verify:** Ensure multi-user isolation, end-to-end authentication, voice performance, and Kubernetes deployment health.

## Governance

**Constitution supersedes all other practices.** Amendments require documentation and approval.

**Version**: 2.1.0 | **Ratified**: 2025-12-25 | **Last Amended**: 2026-01-01
