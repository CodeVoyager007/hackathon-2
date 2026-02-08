---
description: "Task list for Phase 5: Distributed Event-Driven Architecture"
---

# Tasks: Phase 5 - Distributed Event-Driven Architecture

**Input**: Design documents from `/specs/005-phase-5-distributed/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/, research.md, quickstart.md

## Dependencies & Execution Order

1. **Foundational (Phase 2)** MUST be complete before any user stories.
2. **Event Publishing (Phase 5)** MUST be complete before Reminders or Recurring Tasks.
3. **User Stories 1 & 2 (Phase 3 & 4)** can run in parallel with Service Setup.
4. **Cloud Deployment (Phase 8)** depends on all microservices being functional.

## Phase 1: Setup (Infrastructure Initialization)

**Purpose**: Local development environment and project scaffolding.

- [ ] T001 Initialize Dapr on Minikube per quickstart.md: `dapr init -k`
- [ ] T002 Setup Kafka (Strimzi) on Minikube in `kafka` namespace
- [ ] T003 Create `dapr-components/` directory in project root
- [ ] T004 [P] Create `notification-service/` directory and initialize FastAPI project
- [ ] T005 [P] Create `recurring-task-service/` directory and initialize FastAPI project

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core data changes and shared infrastructure.

- [ ] T006 Write migration script to add `priority`, `tags`, `due_date`, `recurrence` to `tasks` table in `backend/src/models/task.py`
- [ ] T007 Create `reminders` table migration script in `backend/src/models/task.py`
- [ ] T008 [P] Update `Task` SQLModel in `backend/src/models/task.py` with new fields
- [ ] T009 [P] Create `Reminder` SQLModel in `backend/src/models/task.py`
- [ ] T010 Create `kafka-pubsub.yaml` Dapr component in `deploy/helm/templates/dapr-components/`
- [ ] T011 Create `statestore.yaml` Dapr component in `deploy/helm/templates/dapr-components/`

---

## Phase 3: User Story 1 - Advanced Task Management (Priority: P1)

**Goal**: Support priorities, tags, and due dates in UI and API.

- [ ] T012 [P] [US1] Update `TaskCreate` and `TaskUpdate` schemas in `backend/src/schemas/task.py`
- [ ] T013 [US1] Update `add_task` MCP tool in `backend/src/services/tools.py` to handle new fields
- [ ] T014 [US1] Update `update_task` MCP tool in `backend/src/services/tools.py` to handle new fields
- [ ] T015 [P] [US1] Add priority selector and tags input to `frontend/src/components/create-task-dialog.tsx`
- [ ] T016 [P] [US1] Install `react-datepicker` and add to `frontend/src/components/create-task-dialog.tsx`
- [ ] T017 [US1] Display priority badges and tags on `frontend/src/components/task-card.tsx`
- [ ] T018 [US1] Add overdue visual highlighting to `frontend/src/components/task-card.tsx`

---

## Phase 4: User Story 2 - Task Organization & Discovery (Priority: P1)

**Goal**: Search, filter, and sort tasks.

- [ ] T019 [US2] Implement keyword search logic in `list_tasks` service in `backend/src/services/task_service.py`
- [ ] T020 [US2] Implement priority, tags, and status filtering in `backend/src/services/task_service.py`
- [ ] T021 [US2] Implement sort logic (created, due date, priority) in `backend/src/services/task_service.py`
- [ ] T022 [P] [US2] Add search bar and filter dropdowns to `frontend/src/app/dashboard/page.tsx`
- [ ] T023 [P] [US2] Add sort selection dropdown to `frontend/src/app/dashboard/page.tsx`

---

## Phase 5: User Story 5 - Event-Driven Reliability (Priority: P1 - Technical)

**Goal**: Publish task events to Kafka via Dapr.

- [ ] T024 [US5] Implement `publish_event` utility in `backend/src/services/task_service.py` using Dapr Pub/Sub API
- [ ] T025 [US5] Publish `task.created` event in `backend/src/api/routes/tasks.py`
- [ ] T026 [US5] Publish `task.updated` and `task.completed` events in `backend/src/api/routes/tasks.py`
- [ ] T027 [US5] Publish `task.deleted` event in `backend/src/api/routes/tasks.py`

---

## Phase 6: User Story 4 & 6 - Smart Reminders & Notification Service (Priority: P2)

**Goal**: Schedule reminders using Dapr Jobs API and deliver via Notification Service.

- [ ] T028 [US6] Implement `schedule_reminder_job` in `backend/src/services/task_service.py` using Dapr Jobs API
- [ ] T029 [US6] Call `schedule_reminder_job` when task is created/updated with `due_date`
- [ ] T030 [US4] Implement `/api/jobs/trigger` endpoint in `notification-service/main.py`
- [ ] T031 [US4] Implement browser push notification logic in `notification-service/main.py`
- [ ] T032 [US4] Create `Dockerfile` and `requirements.txt` for `notification-service/`

---

## Phase 7: User Story 3 & 6 - Recurring Tasks & Service (Priority: P2)

**Goal**: Automatically create next task occurrence via Recurring Task Service.

- [ ] T033 [US6] Implement Dapr subscription to `task-events` in `recurring-task-service/main.py`
- [ ] T034 [US3] Implement logic to calculate next occurrence date in `recurring-task-service/main.py`
- [ ] T035 [US3] Implement Dapr service invocation to Backend for task creation in `recurring-task-service/main.py`
- [ ] T036 [US6] Create `Dockerfile` and `requirements.txt` for `recurring-task-service/`

---

## Phase 8: User Story 7 - Cloud-Native Deployment (Priority: P3 - Technical)

**Goal**: Production-ready Kubernetes deployment and CI/CD.

- [ ] T037 [US7] Create Helm templates for `notification-service` and `recurring-task-service` in `deploy/helm/todo-chatbot/templates/`
- [ ] T038 [US7] Add Dapr annotations and resource limits to all Helm deployment templates
- [ ] T039 [US7] Create environment-specific values files: `values-prod-azure.yaml`, `values-prod-gcp.yaml`, `values-prod-oracle.yaml`
- [ ] T040 [US7] Create `.github/workflows/deploy.yml` for automated build and deploy
- [ ] T041 [US7] Provision cloud K8s cluster (AKS/GKE/OKE) and install Dapr

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, documentation, and demo.

- [ ] T042 Update `README.md` with Phase 5 architecture diagram and Kafka event schemas
- [ ] T043 [P] Setup Prometheus and Grafana for Dapr/Kafka monitoring in Minikube
- [ ] T044 Perform end-to-end smoke tests on cloud deployment
- [ ] T045 Record 90-second demo video of the distributed event-driven system

## Parallel Execution Examples (Story-Based)

### User Story 1 (P1)
```bash
# Backend
Task T012: Update schemas
Task T013: Update MCP tools
# Frontend
Task T015: Priority/Tags UI
Task T016: DatePicker
```

### Infrastructure Setup
```bash
# These can run while backend/frontend are being updated
Task T004: Scaffold Notification Service
Task T005: Scaffold Recurring Task Service
Task T010: Kafka Component
Task T011: Statestore Component
```

## Implementation Strategy

1. **MVP (Phase 1-4)**: Get advanced task features working with standard DB persistence first.
2. **Distributed (Phase 5-7)**: Layer in the event-driven microservices.
3. **Cloud (Phase 8)**: Move the verified local setup to production Kubernetes.
