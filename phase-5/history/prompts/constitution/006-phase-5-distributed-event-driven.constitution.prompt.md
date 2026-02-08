---
id: 006
title: phase-5-distributed-event-driven
stage: constitution
date: 2026-02-08
surface: agent
model: gemini-2.0-flash
feature: phase-5-distributed
branch: phase-5
user: Dell
command: /sp.constitution
labels: ["phase-5", "distributed", "event-driven", "kafka", "dapr"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
 - .specify/templates/plan-template.md
tests:
 - none
---

## Prompt

/sp.constitution

You are Gemini/Claude acting as a senior Cloud-Native/Event-Driven Systems engineer executing Phase-5 of a Spec-Driven Development workflow using Spec-Kit Plus.

PHASE-5 OBJECTIVE
Transform the existing Phase-3 Todo AI Chatbot into a distributed, event-driven, cloud-native system deployed on production Kubernetes (Azure AKS / Google Cloud GKE / Oracle OKE) with Kafka and Dapr.

This phase introduces:
- Advanced todo features (Recurring Tasks, Due Dates, Priorities, Tags, Search, Sort)
- Event-driven architecture using Kafka (Self-hosted Strimzi OR Redpanda Cloud OR Confluent Cloud)
- Distributed application runtime using Dapr
- Multiple microservices (Notification Service, Recurring Task Service)
- Production deployment on Azure AKS / Google Cloud GKE / Oracle OKE
- CI/CD pipeline with GitHub Actions
- Monitoring and logging

The existing Phase-2, Phase-3, and Phase-4 code is preserved and enhanced.

CORE PRINCIPLES
- Spec-first development is mandatory (Agentic Dev Stack workflow)
- No manual coding; Gemini/Claude CLI performs all changes
- All previous phase functionality must remain intact
- Event-driven architecture - services communicate via events
- Stateless services - all state in database or Kafka
- Dapr sidecars for all infrastructure concerns
- Cloud-native best practices

ARCHITECTURAL CONSTRAINTS

Application Layer (Enhanced):
- Frontend: Next.js (App Router), TypeScript, Tailwind CSS, OpenAI ChatKit
- Backend: FastAPI, SQLModel, Neon PostgreSQL, OpenAI Agents SDK, MCP SDK
- New Services: Notification Service, Recurring Task Service, (Optional: Audit Service, WebSocket Service)

Event-Driven Layer (New):
- Message Broker: Kafka (Self-hosted Strimzi in K8s OR Redpanda Cloud OR Confluent Cloud)
- Event Topics: task-events, reminders, task-updates
- Event Schemas: Standardized JSON schemas for all events

Distributed Runtime Layer (New):
- Dapr: All services run with Dapr sidecars
- Dapr Components: Pub/Sub (Kafka), State Store (PostgreSQL), Jobs API (Reminders), Secrets
- Communication: Services use Dapr APIs instead of direct dependencies

Infrastructure Layer:
- Local: Minikube with Dapr + Kafka (Strimzi)
- Cloud: Azure AKS / Google Cloud GKE / Oracle OKE with Dapr + Kafka
- Registry: Docker Hub or GitHub Container Registry or Azure Container Registry or Google Container Registry
- CI/CD: GitHub Actions
- Package Management: Helm Charts (updated from Phase-4)

KEY DESIGN RULES
1. All services MUST be stateless - state only in DB or Kafka
2. Services communicate ONLY through Kafka events (via Dapr Pub/Sub)
3. No direct service-to-service HTTP calls except via Dapr service invocation
4. All infrastructure concerns (Kafka, DB, Secrets) accessed via Dapr
5. Dapr components must be swappable (e.g., Kafka → RabbitMQ via config)
6. Event schemas must be versioned and documented
7. All deployments via Helm with environment-specific values
8. CI/CD pipeline must include automated testing
9. Use Dapr Jobs API for scheduled reminders (NOT cron bindings)

DEPLOYMENT TARGETS
- Local: Minikube + Dapr + Strimzi Kafka (development and testing)
- Cloud: Azure AKS / Google Cloud GKE / Oracle OKE + Dapr + Kafka (production)

CLOUD PLATFORM OPTIONS

Option 1: Microsoft Azure (AKS)
- Credits: $200 for 30 days + 12 months free services
- Service: Azure Kubernetes Service (AKS)
- Registry: Azure Container Registry (ACR)
- Kafka: Self-hosted Strimzi OR Confluent Cloud

Option 2: Google Cloud (GKE)
- Credits: $300 for 90 days
- Service: Google Kubernetes Engine (GKE)
- Registry: Google Container Registry (GCR) or Artifact Registry
- Kafka: Self-hosted Strimzi OR Confluent Cloud

Option 3: Oracle Cloud (OKE) - RECOMMENDED
- Credits: Always Free tier (4 OCPUs, 24GB RAM)
- Service: Oracle Container Engine for Kubernetes (OKE)
- Registry: Oracle Cloud Infrastructure Registry (OCIR)
- Kafka: Self-hosted Strimzi (free tier sufficient)
- Why: No time pressure, no credit expiration for free tier

NEW FEATURES TO IMPLEMENT

Intermediate Level:
- Priorities (high/medium/low)
- Tags/Categories (work/home/personal)
- Search by keyword
- Filter by status/priority/tags
- Sort by due date/priority/title

Advanced Level:
- Recurring tasks (daily/weekly/monthly patterns)
- Due dates with date/time pickers
- Reminder notifications (browser push, email)
- Auto-create next occurrence when recurring task completed

MICROSERVICES ARCHITECTURE

Core Services:
1. Frontend Service (existing, enhanced with new features)
2. Backend Service (existing, enhanced to publish events)
3. Notification Service (NEW) - consumes reminders topic
4. Recurring Task Service (NEW) - consumes task-events topic

Optional Services:
5. Audit Service - logs all events for compliance
6. WebSocket Service - real-time client sync

All services MUST have Dapr sidecar.

## Response snapshot

Updated constitution to v3.0.0 incorporating Phase 5 requirements (Event-Driven, Dapr, Kubernetes). Updated plan-template.md to match.

## Outcome

- ✅ Impact: Constitution updated to support Phase 5.
- 🧪 Tests: None
- 📁 Files: .specify/memory/constitution.md, .specify/templates/plan-template.md
- 🔁 Next prompts: /sp.spec (to define the new features)
- 🧠 Reflection: Major architectural shift; ensures strict adherence to event-driven principles.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
