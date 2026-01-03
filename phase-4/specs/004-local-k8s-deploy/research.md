# Research & Decisions: Phase 4 Local Kubernetes Deployment

**Feature Branch**: `004-local-k8s-deploy`
**Date**: 2026-01-01

## 1. Container Base Images

### Context
We need to containerize the Next.js frontend and FastAPI backend.

### Options Considered
- **Option A: Full OS Images (Ubuntu/Debian)**: Large size (>500MB), high compatibility.
- **Option B: Distroless**: Minimal size, high security, harder to debug (no shell).
- **Option C: Alpine/Slim (Spec Mandate)**: `node:20-alpine` and `python:3.13-slim`.

### Decision
**Option C: Alpine/Slim**

**Rationale**:
- **Spec Compliance**: Explicitly requested in FR-001/Key Entities.
- **Size**: Alpine and Slim variants are significantly smaller, helping meet SC-001 (<500MB).
- **Security**: Smaller attack surface than full OS images.
- **DevEx**: Still contain shells for debugging (unlike Distroless), fitting the "local-first" dev loop.

## 2. Helm Chart Architecture

### Context
We need to deploy two services (frontend, backend) that share some configuration but have different lifecycles and scaling needs.

### Options Considered
- **Option A: Two Separate Charts**: Independent deployments. Harder to manage shared config/secrets.
- **Option B: Umbrella Chart**: Parent chart with sub-charts. Overkill for 2 services.
- **Option C: Single Chart with Multiple Deployments**: Simplest for monorepo.

### Decision
**Option C: Single Chart**

**Rationale**:
- **Simplicity**: Easier to manage in a single `deploy/helm/todo-chatbot` directory.
- **Shared Config**: Can share one `secrets.yaml` and `configmap.yaml` template easily across both deployments.
- **Atomic Deploys**: `helm install todo-chatbot` deploys everything together.

## 3. Local Development & Secrets

### Context
We need to inject API keys (OpenAI, Gemini, Neon DB) into Minikube pods securely.

### Options Considered
- **Option A: External Secrets Operator**: Production standard, but complex for local setup.
- **Option B: SOPS**: Encrypted git files. Good for teams, adds friction for solo local dev.
- **Option C: Manual Secret Creation / .env Loading**: Simple, standard for Minikube.

### Decision
**Option C: Manual Secret Creation via Helm**

**Rationale**:
- **Speed**: We can pass secrets via `--set-file` or a local `secrets.yaml` ignored by git.
- **Simplicity**: Matches "Basic Level Functionality" scope.
- **Safety**: We will rely on `.gitignore` to keep local `values.secrets.yaml` out of repo.

## 4. AIOps Integration Strategy

### Context
Integrating `kubectl-ai` and `kagent` into the workflow.

### Decision
- **kubectl-ai**: Used as a CLI tool for ad-hoc operations. No cluster installation required (it runs locally).
- **kagent**: Installed as a Deployment in the cluster to monitor events and logs continuously.
- **Gordon**: Used during the `docker build` phase for optimization suggestions.
