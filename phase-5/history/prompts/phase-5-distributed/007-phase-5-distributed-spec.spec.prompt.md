---
id: 007
title: phase-5-distributed-spec
stage: spec
date: 2026-02-08
surface: agent
model: gemini-2.0-flash
feature: phase-5-distributed
branch: 005-phase-5-distributed
user: Dell
command: /sp.specify
labels: ["phase-5", "spec", "distributed", "event-driven"]
links:
  spec: specs/005-phase-5-distributed/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/005-phase-5-distributed/spec.md
 - specs/005-phase-5-distributed/checklists/requirements.md
tests:
 - none
---

## Prompt

/sp.specify

$ARGUMENTS = "Define specifications for Phase-5: Advanced Cloud Deployment with Event-Driven Architecture on Azure/GCP/Oracle. SYSTEM OVERVIEW Transform the Todo AI Chatbot into a distributed, event-driven system with advanced features, deployed on production Kubernetes (Azure AKS / Google Cloud GKE / Oracle OKE) using Kafka and Dapr. USER STORIES US1: As a user, I can assign priorities to my tasks - Acceptance Criteria: - Tasks have priority field: high/medium/low - UI shows priority indicators (colors/badges) - Can filter tasks by priority - Can sort tasks by priority - Chatbot understands "high priority", "urgent", "low priority" US2: As a user, I can organize tasks with tags - Acceptance Criteria: - Tasks have tags field (array of strings) - Common tags: work, home, personal, urgent - UI shows tags as badges - Can filter tasks by tag - Chatbot can add tags: "tag this as work" US3: As a user, I can search and filter my tasks - Acceptance Criteria: - Search by title or description (keyword) - Filter by status (pending/completed) - Filter by priority - Filter by tags - Combined filters work together - Chatbot: "show me urgent work tasks" US4: As a user, I can sort my tasks - Acceptance Criteria: - Sort by created date (newest/oldest) - Sort by due date (soonest first) - Sort by priority (high to low) - Sort alphabetically by title - UI persists sort preference US5: As a user, I can set due dates and times for tasks - Acceptance Criteria: - Tasks have due_date field (datetime) - UI has date/time picker - Overdue tasks visually highlighted - Chatbot: "remind me tomorrow at 3pm" - Due date displays in user's timezone US6: As a user, I receive reminders for upcoming tasks - Acceptance Criteria: - Browser push notifications (when app open) - Can set reminder time (1hr, 1day before) - Notification shows task title and due time - User can dismiss or snooze - Notification service handles delivery - Uses Dapr Jobs API for exact-time scheduling US7: As a user, I can create recurring tasks - Acceptance Criteria: - Tasks have recurrence pattern: daily/weekly/monthly/yearly - When marked complete, next occurrence auto-creates - Can edit/delete recurrence pattern - Chatbot: "remind me every Monday" - Recurring Task Service handles automation US8: As a developer, task operations publish events to Kafka - Acceptance Criteria: - Create/Update/Complete/Delete publish to task-events - Events include full task data and metadata - Events follow standardized schema - Publishing via Dapr Pub/Sub (not direct Kafka) - No blocking - events published async US9: As a developer, services consume events via Dapr - Acceptance Criteria: - Notification Service subscribes to reminders topic - Recurring Task Service subscribes to task-events topic - Services use Dapr subscriptions (not Kafka consumers) - Services process events idempotently - Failed events handled gracefully US10: As a developer, the application deploys to Azure/GCP/Oracle Kubernetes - Acceptance Criteria: - All services deployed to AKS/GKE/OKE - Dapr installed and configured on cluster - Kafka (Strimzi OR Redpanda/Confluent Cloud) connected - Database (Neon) connected - Secrets managed via Kubernetes Secrets (optionally via Dapr Secrets API) - Health checks passing - Logging and monitoring configured US11: As a developer, CI/CD pipeline automates deployments - Acceptance Criteria: - GitHub Actions workflow defined - On push to main: build, test, deploy - Automated Docker image builds - Automated Helm chart deployments - Rollback capability on failure - Deployment notifications EVENT SPECIFICATIONS Topic: task-events - Producer: Backend Service (MCP Tools) - Consumers: Recurring Task Service, Audit Service - Event Types: task.created, task.updated, task.completed, task.deleted - Schema: ... Topic: reminders - Producer: Backend Service (when due_date set) - Consumer: Notification Service - Schema: ... Topic: task-updates (Optional for real-time sync) - Producer: Backend Service - Consumer: WebSocket Service - Purpose: Broadcast changes to all connected clients DAPR COMPONENT SPECIFICATIONS Pub/Sub Component (kafka-pubsub): ... State Store Component (statestore): ... Jobs API Component (for reminders): ... Secret Store Component (kubernetes-secrets) - OPTIONAL: ... MICROSERVICE SPECIFICATIONS Notification Service: - Language: Python (FastAPI) - Port: 8001 - Dapr App ID: notification-service - Subscribes To: reminders (via Dapr Pub/Sub) - Handles Jobs API callbacks at: POST /api/jobs/trigger - Responsibilities: - Receive scheduled job callbacks from Dapr Jobs API - Send browser push notifications - (Optional) Send email notifications - Mark reminders as sent - Health Check: GET /health Recurring Task Service: - Language: Python (FastAPI) - Port: 8002 - Dapr App ID: recurring-task-service - Subscribes To: task-events (filter: task.completed) - Responsibilities: - Detect when recurring task is completed - Calculate next occurrence date - Create new task via Backend API (Dapr service invocation) - Publish task.created event - Health Check: GET /health Backend Service (Enhanced): - Existing FastAPI service - New Responsibilities: - Publish events to Kafka via Dapr for all task operations - Schedule reminders using Dapr Jobs API when due_date is set - Handle new fields: priority, tags, due_date, recurrence - Dapr Integration: - Publish: POST http://localhost:3500/v1.0/publish/kafka-pubsub/task-events - Schedule Job: POST http://localhost:3500/v1.0-alpha1/jobs/reminder-{task_id} - State: POST http://localhost:3500/v1.0/state/statestore - Secrets (optional): GET http://localhost:3500/v1.0/secrets/kubernetes-secrets/{key} DATABASE SCHEMA UPDATES Tasks Table (Enhanced): ... New Table: reminders ... New Table: events (Optional audit log) ... HELM CHART UPDATES New values for Phase-5: ... CI/CD PIPELINE SPECIFICATION GitHub Actions Workflow (.github/workflows/deploy.yml): ... Cloud Platform Specific Requirements: ... DEPLOYMENT TARGETS Minikube (Local): ... Azure AKS: ... Google Cloud GKE: ... Oracle Cloud OKE (RECOMMENDED): ... SUCCESS CRITERIA 1. All 11 User Stories acceptance criteria met 2. Events publish and consume successfully via Dapr 3. Recurring tasks auto-create when completed 4. Reminders trigger at exact scheduled time (Dapr Jobs API) 5. All services have 99%+ uptime 6. Application deployed to both Minikube and cloud (AKS/GKE/OKE) 7. CI/CD pipeline successfully deploys 8. Monitoring dashboards show healthy metrics (if implemented) 9. All Phase I-IV features still work 10. Demo video showcases event-driven architecture"

## Response snapshot

Created feature branch `005-phase-5-distributed` and specification file. The spec defines 7 user stories (4 user-facing, 3 technical) covering Priorities, Tags, Search, Reminders, and Event-Driven architecture. Validated against checklist with exception notes for technical implementation details which are required for this phase.

## Outcome

- ✅ Impact: Specification created and validated.
- 🧪 Tests: None
- 📁 Files: specs/005-phase-5-distributed/spec.md, specs/005-phase-5-distributed/checklists/requirements.md
- 🔁 Next prompts: /sp.plan
- 🧠 Reflection: The user's input was highly detailed, serving almost as a plan. The spec captures the "What" while preserving the "How" constraints as requirements.

## Evaluation notes (flywheel)

- Failure modes observed: PowerShell script issue with arguments, file existence check confusion.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
