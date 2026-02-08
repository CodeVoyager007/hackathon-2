# Implementation Plan: Phase 5 - Distributed Event-Driven Architecture

**Branch**: `005-phase-5-distributed` | **Date**: 2026-02-08 | **Spec**: [specs/005-phase-5-distributed/spec.md](spec.md)
**Input**: Feature specification from `/specs/005-phase-5-distributed/spec.md`

## Summary

This phase transforms the existing Todo AI Chatbot into a distributed, event-driven system deployed on production Kubernetes (AKS/GKE/OKE). It introduces advanced task features (Priorities, Tags, Due Dates, Recurring Tasks), a new **Notification Service** and **Recurring Task Service**, and integrates **Kafka** (message broker) and **Dapr** (distributed application runtime). Communication between services will shift from direct API calls to asynchronous events via Dapr Pub/Sub, ensuring decoupling and high availability.

## Technical Context

**Language/Version**: Python 3.11+ (Backend), TypeScript 5+ (Frontend)
**Primary Dependencies**: FastAPI, SQLModel, Dapr Python SDK, Next.js 15+ (App Router), Tailwind CSS
**Storage**: Neon Serverless PostgreSQL (Application Data), Kafka (Event Log)
**Testing**: pytest (Backend Unit/Integration), Playwright (E2E)
**Target Platform**: Kubernetes 1.25+ (Minikube Local, AKS/GKE/OKE Production)
**Project Type**: Distributed Microservices (Web App + Background Services)
**Performance Goals**: <500ms event propagation, <2s API latency, <1min job scheduling precision
**Constraints**: Stateless services, Event-Driven Architecture, Cloud-Agnostic (Dapr abstraction)
**Scale/Scope**: 2 new microservices, 3 Kafka topics, 11 user stories, Multi-cloud support

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Spec-First**: Is there a spec.md?
- [x] **Legacy**: Does this preserve Phase 2, 3 & 4 features?
- [x] **Additive UI**: Is voice additive, not replacing UI? (Principle IV)
- [x] **Privacy**: Is voice data transient & encrypted? (Principle VII)
- [x] **Performance**: Can this meet <2s latency? (Principle IX)
- [x] **Stateless**: Is server state avoided? (Principle X)
- [x] **Separation**: Is DB access restricted to Backend? (Principle XI)
- [x] **IaC**: Is deployment defined via Helm charts? (Principle XIII)
- [x] **AI-Ops**: Are AIOps tools (kubectl-ai, kagent) integrated? (Principle XIV)
- [x] **Local-First**: Is Minikube the primary dev target? (Principle XV)
- [x] **Containers**: Are images production-ready (health checks)? (Principle XVI)
- [x] **Event-Driven**: Is communication async via Kafka? (Principle XVII)
- [x] **Dapr-ized**: Are sidecars used for all infra? (Principle XVIII)
- [x] **Portable**: Is it deployable to AKS/GKE/OKE? (Principle XIX)

## Project Structure

### Documentation (this feature)

```text
specs/005-phase-5-distributed/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
backend/                 # Core API Service (Enhanced)
├── src/
│   ├── models/          # Updated Task, Reminder models
│   ├── services/        # Kafka Producer logic
│   └── api/             # API Endpoints
├── Dockerfile
└── requirements.txt

frontend/                # Next.js UI (Enhanced)
├── src/
│   ├── components/      # New Badge, DatePicker, Filter components
│   ├── app/             # Updated pages
│   └── lib/
├── Dockerfile
└── package.json

notification-service/    # NEW Microservice
├── main.py              # FastAPI app with Dapr Pub/Sub
├── models.py
├── Dockerfile
└── requirements.txt

recurring-task-service/  # NEW Microservice
├── main.py              # FastAPI app with Dapr Pub/Sub
├── models.py
├── Dockerfile
└── requirements.txt

deploy/
├── helm/                # Updated Helm Charts
│   ├── templates/
│   │   ├── dapr-components/ # Kafka, Statestore, Secrets components
│   │   ├── notification.yaml
│   │   └── recurring.yaml
│   └── values.yaml
└── k8s/                 # Raw manifests (optional/reference)
```

**Structure Decision**: Microservices architecture with shared monorepo. New services get their own top-level directories to maintain clean separation of concerns and independent deployability (though they share the repo). Helm charts unified in `deploy/helm`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Multiple Services | Requirement for distributed/event-driven arch | Monolith violates Phase 5 "Distributed" objective |
| Kafka | Requirement for robust event sourcing | RabbitMQ/Redis PubSub less suitable for event sourcing/replay |
| Dapr | Requirement for cloud portability & sidecars | Direct SDKs create vendor lock-in & tight coupling |
