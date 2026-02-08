<!--
Sync Impact Report:
- Version change: 2.1.0 -> 3.0.0
- Rationale: Major architectural transformation to a distributed, event-driven system using Dapr and Kafka for Phase 5.
- List of modified principles:
  - Modified: II. Legacy Preservation (Expanded to include Phase 4)
  - Modified: X. Stateless Architecture (Explicitly references Kafka)
  - Added: XVII. Event-Driven Architecture
  - Added: XVIII. Distributed Runtime (Dapr)
  - Added: XIX. Cloud-Native Portability
- Templates requiring updates:
  - .specify/templates/plan-template.md (Constitution Check updated)
- Follow-up TODOs: None
-->
# AI-Powered Distributed Conversational Todo Application Constitution

## Core Principles

### I. Spec-First Development
**Spec-first development is mandatory.** No implementation code may be written before a specification and plan have been approved. This ensures clarity, reduces churn, and guarantees that all features are intentional and well-designed.

### II. Legacy Preservation
**Phase-2, Phase-3, and Phase-4 functionality must remain intact.** The existing frontend, backend, authentication, database, voice chatbot, and initial Kubernetes configurations are preserved. New features (distributed events, microservices) extend the architecture without breaking existing flows.

### III. Gemini-Only Coding
**Gemini is the only entity allowed to write code.** This maintains a unified coding style, ensures all changes are tracked through the agent's context, and prevents human-introduced errors or style inconsistencies that bypass the spec process.

### IV. Seamless Integration (Additive UI)
**Voice is additive to existing UI, not a replacement.** Visual feedback MUST accompany all voice interactions. The system works alongside keyboard and touch interactions, ensuring users can switch modalities fluidly.

### V. Natural Language Understanding
**Users speak naturally, not in rigid commands.** The system MUST understand context, variations, and conversational patterns. Rigid syntax is forbidden.

### VI. Conversational AI Integration
**Leverage AI for intent and entity extraction.** Use AI (e.g., Gemini/OpenAI/Claude via MCP) to parse requests. The system MUST confirm ambiguous requests before executing actions.

### VII. Privacy & Security
**Privacy by design and default.**
*   **Voice Data:** Processed with explicit user consent. No permanent storage of raw voice recordings.
*   **Ethical Data Use:** No training on user voice data without explicit, separate opt-in.
*   **Encryption:** End-to-end encryption for voice transmission and data at rest.
*   **Auth:** Authentication and authorization enforced on every request. Multi-tenant data isolation is mandatory.

### VIII. Accessibility & Inclusion
**Voice as a primary, inclusive interaction method.** It must work for users with mobility challenges or hands-free preferences. Support multi-language input.

### IX. Performance & Reliability
**Speed and stability are critical.**
*   **Latency:** <2 second response time from speech completion to action.
*   **Event Latency:** <500ms event propagation between services.
*   **Resilience:** Zero data loss on service crashes (guaranteed by Kafka).

### X. Stateless Architecture
**Services must be stateless.** All application state must be persisted in the database (Neon PostgreSQL) or the event log (Kafka). No in-memory state retention across requests is permitted.

### XI. Strict Separation of Concerns
**Frontend and backend responsibilities remain strictly separated.** The backend provides a secure REST API; the frontend consumes it. No direct database access from the frontend.

### XII. Monorepo Architecture
**Monorepo structure using Spec-Kit Plus.** The project uses a single repository to house frontend, backend, and new microservices, managed with unified tooling.

### XIII. Infrastructure as Code (IaC)
**All deployments MUST be defined via Helm charts.** No manual resource creation is permitted. Configuration management uses standard IaC practices (Helm) to ensure reproducibility.

### XIV. AI-Augmented Operations
**Utilize AI agents for operational tasks.**
*   **kubectl-ai:** For generating and applying Kubernetes manifests and debugging.
*   **kagent:** For intelligent cluster monitoring and anomaly detection.
*   **Gordon:** For Docker container management and optimization.

### XV. Local-First Kubernetes
**Development targets Minikube first.** All infrastructure and application changes must be verified locally on Minikube with Dapr and Kafka before any cloud deployment.

### XVI. Containerization Standards
**Containers must be production-ready.**
*   **Health Checks:** Explicit liveness and readiness probes required.
*   **Resources:** CPU/Memory requests and limits must be defined.
*   **Security:** Non-root users where possible; minimal base images.

### XVII. Event-Driven Architecture
**Communication via immutable events.** Services communicate primarily through asynchronous events (Kafka) via Dapr Pub/Sub. Direct HTTP calls between services are forbidden except via Dapr Service Invocation for specific real-time needs.

### XVIII. Distributed Runtime (Dapr)
**Dapr abstracts infrastructure concerns.** All services run with Dapr sidecars. Application code relies on Dapr APIs for Pub/Sub, State Management, Secrets, and Scheduled Jobs (Reminders).

### XIX. Cloud-Native Portability
**Deploy anywhere.** The architecture supports Azure AKS, Google Cloud GKE, and Oracle OKE without code changes, using Dapr to abstract platform-specific differences (e.g., swapping underlying message brokers if needed, though Kafka is the standard).

## Success Metrics

*   **Accuracy:** 95%+ intent recognition rate.
*   **Speed:** <2s average response time; <500ms event propagation.
*   **Reliability:** 99.9% uptime for core services.
*   **Scalability:** Horizontal scaling of consumers based on lag.
*   **Observability:** 100% of inter-service calls traced via Dapr/Zipkin.
*   **Deployment:** 100% automated CI/CD via GitHub Actions.

## Tech Stack Laws

**Frontend:**
*   **Framework:** Next.js 16+ (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS, shadcn/ui
*   **AI UI:** OpenAI ChatKit UI
*   **Package Manager:** npm

**Backend & Microservices:**
*   **Framework:** FastAPI (Python)
*   **Runtime:** Dapr (Python SDK)
*   **ORM:** SQLModel
*   **AI SDK:** OpenAI Agents SDK (configured for Gemini API)
*   **Tools:** Official MCP SDK
*   **Package Manager:** uv

**Infrastructure:**
*   **Database:** Neon Serverless PostgreSQL
*   **Message Broker:** Kafka (Strimzi / Redpanda / Confluent)
*   **Distributed Runtime:** Dapr (Sidecars, Components)
*   **Authentication:** Better Auth with JWT
*   **Container Engine:** Docker
*   **Orchestration:** Kubernetes (Minikube, AKS, GKE, OKE)
*   **Package Management:** Helm Charts
*   **CI/CD:** GitHub Actions

## Development Workflow

1.  **Spec:** Define the feature in a `spec.md` file (User Stories, Requirements).
2.  **Plan:** Create a technical `plan.md` (Architecture, Dapr Components, Event Schemas).
3.  **Tasks:** Break down the plan into atomic `tasks.md` (Implementation steps).
4.  **Execute:** Implement tasks using Gemini, following Event-Driven principles.
5.  **Verify:** Verify locally on Minikube with Dapr/Kafka before cloud deployment.

## Governance

**Constitution supersedes all other practices.** Amendments require documentation and approval.

**Version**: 3.0.0 | **Ratified**: 2025-12-25 | **Last Amended**: 2026-02-08