# Research: Phase 5 - Distributed Event-Driven Architecture

**Branch**: `005-phase-5-distributed`
**Date**: 2026-02-08

## 1. Dapr Jobs API for Reminders

**Decision**: Use Dapr Jobs API (Alpha/Beta depending on Dapr version) for scheduling exact-time reminders.
**Rationale**: 
- Native Dapr solution for scheduling.
- Eliminates need for external cron service or Quartz.
- Scalable and persists schedule state in the configured state store (PostgreSQL).
- Supports "one-shot" jobs (perfect for due date reminders).
**Alternatives Considered**:
- **CronJob K8s Resource**: Too coarse (minute-level), harder to manage dynamically from app code.
- **Celery/Redis**: Adds another dependency stack (Redis/Worker queues) separate from Dapr.

## 2. Kafka Provider Selection

**Decision**:
- **Local (Minikube)**: Strimzi Kafka Operator (Ephemeral cluster).
- **Cloud (AKS/GKE/OKE)**: Support both Strimzi (Self-Hosted) AND managed providers (Confluent/Redpanda Cloud).
**Rationale**:
- Strimzi is the K8s standard for "Kafka on K8s".
- Managed providers reduce operational overhead for production but cost more.
- Dapr abstraction (`pubsub.kafka`) allows seamless switching via `dapr-components` YAML changes only.

## 3. Recurring Task Logic

**Decision**: "Regenerate on Completion" Strategy.
**Rationale**:
- When a recurring task is marked "Done", the *Recurring Task Service* (consuming `task.completed` event) calculates the *next* due date and creates a *new* task via the Backend API.
- This preserves the history of the completed task and creates a separate entity for the next one.
**Alternatives Considered**:
- **Single Task with shifting due date**: Destroys history of completion. Bad for analytics/audit.
- **Pre-generation**: Creating 365 tasks for a daily recurrence bloats DB.

## 4. Frontend Date Handling

**Decision**: Use `date-fns` for manipulation and `react-day-picker` (via shadcn/ui) for UI.
**Rationale**:
- `date-fns` is lightweight, tree-shakeable, and modern (unlike Moment.js).
- `shadcn/ui` Calendar component uses `react-day-picker` internally, ensuring design consistency.
- **Timezone Rule**: Store all dates in UTC in DB. Convert to User Local Time in Frontend.

## 5. Helm Chart Strategy

**Decision**: Unified Umbrella Chart with Subcharts or Conditionals.
**Rationale**:
- One `helm install` command deploys everything.
- `values.yaml` flags (`notificationService.enabled: true`) control what gets deployed.
- Simplifies CI/CD pipeline logic.

## 6. CI/CD Pipeline

**Decision**: GitHub Actions with `helm upgrade --atomic`.
**Rationale**:
- `atomic` ensures automatic rollback if the deployment fails (e.g., Dapr sidecar crash).
- Standard in K8s deployments.
