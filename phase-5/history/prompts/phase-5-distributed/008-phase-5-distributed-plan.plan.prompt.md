---
id: 008
title: phase-5-distributed-plan
stage: plan
date: 2026-02-08
surface: agent
model: gemini-2.0-flash
feature: phase-5-distributed
branch: 005-phase-5-distributed
user: Dell
command: /sp.plan
labels: ["phase-5", "plan", "distributed", "architecture", "dapr", "kafka"]
links:
  spec: specs/005-phase-5-distributed/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/005-phase-5-distributed/plan.md
 - specs/005-phase-5-distributed/research.md
 - specs/005-phase-5-distributed/data-model.md
 - specs/005-phase-5-distributed/contracts/openapi.yaml
 - specs/005-phase-5-distributed/quickstart.md
tests:
 - none
---

## Prompt

/sp.plan

Create an implementation plan derived from Phase-5 specifications for deployment on Azure/GCP/Oracle.

PHASE 5.1: Database Schema Enhancement
- Add priority, tags, due_date, recurrence columns to tasks table
- Create reminders table with job_name field for Dapr Jobs API
- Create events table (optional)
- Add appropriate indexes for performance
- Write migration scripts (Alembic or raw SQL)
- Update SQLModel models

PHASE 5.2: Backend Service Enhancement
- Add priority/tags/due_date/recurrence to Task model
- Update MCP tools to handle new fields
- Implement event publishing via Dapr Pub/Sub
  - Publish task.created on task creation
  - Publish task.updated on task update
  - Publish task.completed on completion
  - Publish task.deleted on deletion
- Implement Dapr Jobs API scheduling for reminders
  - Schedule job when due_date is set
  - Cancel job when task deleted or due_date removed
- Add search/filter/sort logic to list_tasks tool
- Update API schemas

PHASE 5.3: Frontend Enhancement
- Update UI to show priority badges
- Add tags input/display with multi-select
- Add date/time picker for due dates (react-datepicker or similar)
- Add recurrence pattern selector (dropdown: none/daily/weekly/monthly/yearly)
- Implement search bar
- Add filter dropdowns (priority, tags, status)
- Add sort dropdown (created/due date/priority/title)
- Style overdue tasks visually (red border, exclamation icon)
- Update chatbot prompts to handle new fields
- Test UI changes

PHASE 5.4: Notification Service Implementation
- Create notification-service/ directory
- Initialize FastAPI app in notification-service
- Add requirements.txt (fastapi, httpx, sqlmodel, uvicorn)
- Create Reminder model
- Implement Dapr subscription endpoint (/dapr/subscribe)
- Subscribe to reminders topic
- Implement reminder event handler
- Implement Dapr Jobs API callback endpoint (/api/jobs/trigger)
- Send browser push notifications
- Mark reminders as sent after delivery
- Add health check endpoint (/health)
- Create Dockerfile for notification-service
- Test service locally with Dapr

PHASE 5.5: Recurring Task Service Implementation
- Create recurring-task-service/ directory
- Initialize FastAPI app in recurring-task-service
- Add requirements.txt (fastapi, httpx, sqlmodel, uvicorn)
- Create Task model
- Implement Dapr subscription endpoint (/dapr/subscribe)
- Subscribe to task-events topic (filter: task.completed)
- Implement task completion event handler
- Check if task has recurrence pattern
- Calculate next occurrence date based on pattern
- Call Backend API to create next task (via Dapr service invocation)
- Add health check endpoint (/health)
- Create Dockerfile for recurring-task-service
- Test service locally with Dapr

PHASE 5.6: Dapr Components Configuration
- Create dapr-components/ directory
- Create kafka-pubsub.yaml component (for Strimzi)
- Create kafka-pubsub-cloud.yaml component (for Redpanda/Confluent - alternative)
- Create statestore.yaml component (PostgreSQL)
- Create kubernetes-secrets.yaml component (optional)
- Test components on Minikube

PHASE 5.7: Kafka Setup

Option A: Self-Hosted Kafka (Strimzi) in Kubernetes
- Create kafka namespace
- Install Strimzi operator via Helm or kubectl
- Create Kafka cluster YAML (1 replica for dev, 3 for prod)
- Apply Kafka cluster
- Wait for Kafka to be ready
- Create topics: task-events, reminders, task-updates
- Document connection details (bootstrap server URL)

Option B: Redpanda Cloud (Managed)
- Sign up for Redpanda Cloud account
- Create serverless cluster
- Create topics: task-events, reminders, task-updates
- Generate SASL credentials
- Document connection details in .env.example

Option C: Confluent Cloud (Managed)
- Sign up for Confluent Cloud account ($400 credit)
- Create cluster
- Create topics: task-events, reminders, task-updates
- Generate API keys
- Document connection details in .env.example

PHASE 5.8: Helm Chart Updates
- Add notification-service deployment template
- Add recurring-task-service deployment template
- Add Dapr annotations to all deployment templates:
```yaml
  annotations:
    dapr.io/enabled: "true"
    dapr.io/app-id: "service-name"
    dapr.io/app-port: "8000"
```
- Update backend-deployment.yaml with Dapr sidecar annotations
- Update frontend-deployment.yaml with Dapr sidecar annotations
- Add Dapr components to chart templates (in templates/dapr-components/)
- Update values.yaml with new service configs
- Create values-dev.yaml for Minikube
- Create values-prod-azure.yaml for AKS
- Create values-prod-gcp.yaml for GKE
- Create values-prod-oracle.yaml for OKE
- Update ConfigMap with Kafka broker URLs
- Update Secrets with Kafka credentials (if using cloud Kafka)
- Test Helm chart dry-run

PHASE 5.9: Local Deployment Testing (Minikube)
- Install Dapr CLI on local machine
- Initialize Dapr on Minikube (dapr init -k)
- Verify Dapr components installed (dapr status -k)
- Install Strimzi operator on Minikube
- Deploy Kafka cluster via Strimzi
- Wait for Kafka to be ready
- Deploy application via Helm (dev values)
- Verify all pods running with Dapr sidecars
- Test event publishing (create task, check Kafka topic)
- Test Dapr Jobs API (create task with due date, verify job scheduled)
- Test notification service (wait for reminder time, check notification)
- Test recurring task service (complete recurring task, verify new task created)
- Test all advanced features via UI
- Check pod logs for errors
- Test pod restart resilience

PHASE 5.10: Cloud Platform Setup

Option A: Azure AKS
- Install Azure CLI (az)
- Login: az login
- Create resource group
- Create AKS cluster: az aks create
- Get credentials: az aks get-credentials
- Verify: kubectl get nodes

Option B: Google Cloud GKE
- Install gcloud CLI
- Login: gcloud auth login
- Create GKE cluster: gcloud container clusters create
- Get credentials: gcloud container clusters get-credentials
- Verify: kubectl get nodes

Option C: Oracle Cloud OKE (RECOMMENDED)
- Install OCI CLI
- Setup config: oci setup config
- Create OKE cluster via Console or CLI
- Download kubeconfig from Console
- Set KUBECONFIG environment variable
- Verify: kubectl get nodes

Common for All:
- Create namespace for application
- Create Kubernetes secrets for credentials
- Install Dapr on cluster (dapr init -k)
- Deploy Kafka (Strimzi OR configure cloud Kafka connection)

PHASE 5.11: CI/CD Pipeline
- Create .github/workflows/deploy.yml
- Add environment variables as GitHub Secrets:
  - DOCKER_USERNAME, DOCKER_PASSWORD (or registry credentials)
  - KUBECONFIG_BASE64 (base64 encoded kubeconfig)
  - DATABASE_URL
  - OPENAI_API_KEY, GEMINI_API_KEY
  - BETTER_AUTH_SECRET
  - KAFKA credentials (if using cloud Kafka)
- Add job: Run tests (pytest for backend, npm test for frontend)
- Add job: Build Docker images (frontend, backend, notification, recurring-task)
- Add job: Push images to registry
- Add job: Update Helm chart with new image tags
- Add job: Deploy to cloud K8s using helm upgrade
- Add job: Run smoke tests (curl health checks)
- Add job: Rollback on failure
- Configure branch protection (require CI to pass before merge)
- Test pipeline on feature branch
- Merge to main and verify production deployment

PHASE 5.12: Production Deployment
- Push code to main branch (trigger CI/CD)
- Monitor GitHub Actions workflow
- Verify deployment succeeded
- Check all pods running on AKS/GKE/OKE
- Test frontend URL (LoadBalancer IP or domain)
- Test backend API endpoints
- Test event-driven features:
  - Create task with priority/tags/due_date
  - Verify event published to Kafka
  - Complete recurring task, verify next created
  - Wait for reminder, verify notification received
- Monitor logs for errors
- Load test critical paths (optional)

PHASE 5.13: Monitoring & Observability (Optional but Recommended)
- Deploy Prometheus to cluster via Helm
- Deploy Grafana to cluster via Helm
- Configure Prometheus to scrape all services
- Create Grafana dashboard for service health
- Create Grafana dashboard for Kafka metrics (lag, throughput)
- Create Grafana dashboard for API metrics (response times, error rates)
- Set up alerts for high error rates
- Set up alerts for Kafka lag
- Document monitoring setup

PHASE 5.14: Documentation & Demo
- Update README with Phase-5 architecture diagram
- Document Kafka topics and event schemas
- Document Dapr components and their purpose
- Document Dapr Jobs API usage for reminders
- Document CI/CD pipeline workflow
- Create deployment runbook (how to deploy from scratch)
- Create troubleshooting guide (common issues and solutions)
- Document environment variables for all services
- Create cloud provider comparison doc (Azure vs GCP vs Oracle)
- Record 90-second demo video showing:
  - Advanced features (priorities, tags, recurring tasks, exact-time reminders)
  - Event-driven flow (show Kafka messages or Dapr logs)
  - Dapr components (kubectl get components)
  - Multi-service architecture on cloud K8s
  - Dapr Jobs API in action (schedule + callback)
- Upload demo to YouTube/Vimeo
- Add demo link to README

## Response snapshot

Generated implementation plan for Phase 5. Defined architecture for Notification and Recurring Task services, Kafka/Dapr integration, and Helm deployment strategy. Created supporting artifacts (research, data model, contracts). Note: Agent context update skipped due to missing template (action item).

## Outcome

- ✅ Impact: Plan and design artifacts created.
- 🧪 Tests: None
- 📁 Files: specs/005-phase-5-distributed/plan.md, specs/005-phase-5-distributed/research.md, specs/005-phase-5-distributed/data-model.md, specs/005-phase-5-distributed/contracts/openapi.yaml, specs/005-phase-5-distributed/quickstart.md
- 🔁 Next prompts: /sp.tasks
- 🧠 Reflection: Comprehensive plan covering all aspects of the distributed system. The complexity of Kafka/Dapr/K8s setup is significant but broken down into manageable phases.

## Evaluation notes (flywheel)

- Failure modes observed: Missing agent-file-template.md prevented context update.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Fix template path in setup script.
