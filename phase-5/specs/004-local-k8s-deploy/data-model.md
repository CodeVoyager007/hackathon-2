# Infrastructure Data Model: Phase 4

**Feature Branch**: `004-local-k8s-deploy`

## Kubernetes Resources

### 1. Deployments

#### `frontend-deployment`
- **Replicas**: 2
- **Strategy**: RollingUpdate (MaxUnavailable: 1, MaxSurge: 1)
- **Container**: `todo-frontend`
  - **Image**: `todo-chatbot-frontend:latest`
  - **Port**: 3000
  - **LivenessProbe**: GET `/api/health` (InitialDelay: 30s)
  - **ReadinessProbe**: GET `/api/health` (InitialDelay: 5s)
  - **Resources**:
    - Requests: 100m CPU, 128Mi Memory
    - Limits: 500m CPU, 512Mi Memory
  - **Env Vars**:
    - `NEXT_PUBLIC_API_URL`: Value from ConfigMap
    - `BETTER_AUTH_SECRET`: Value from Secret

#### `backend-deployment`
- **Replicas**: 2
- **Strategy**: RollingUpdate
- **Container**: `todo-backend`
  - **Image**: `todo-chatbot-backend:latest`
  - **Port**: 8000
  - **LivenessProbe**: GET `/api/health`
  - **ReadinessProbe**: GET `/api/health`
  - **Resources**:
    - Requests: 200m CPU, 256Mi Memory
    - Limits: 1000m CPU, 1Gi Memory
  - **Env Vars**:
    - `DATABASE_URL`: Value from Secret
    - `OPENAI_API_KEY`: Value from Secret
    - `GEMINI_API_KEY`: Value from Secret
    - `BETTER_AUTH_SECRET`: Value from Secret

### 2. Services

#### `frontend-service`
- **Type**: ClusterIP (accessed via `minikube service` proxy or Ingress in future)
- **Port**: 80 (TargetPort: 3000)
- **Selector**: `app: todo-frontend`

#### `backend-service`
- **Type**: ClusterIP
- **Port**: 8000 (TargetPort: 8000)
- **Selector**: `app: todo-backend`

### 3. Configuration

#### `app-config` (ConfigMap)
- `NEXT_PUBLIC_API_URL`: URL for backend API (cluster-internal or proxied)
- `ENVIRONMENT`: "development"

#### `app-secrets` (Secret)
- `DATABASE_URL`: Neon Connection String
- `OPENAI_API_KEY`: OpenAI Key
- `GEMINI_API_KEY`: Gemini Key
- `BETTER_AUTH_SECRET`: Auth Secret

## Helm Values Structure

```yaml
global:
  environment: development

frontend:
  image:
    repository: todo-chatbot-frontend
    tag: latest
    pullPolicy: Never # Local Minikube
  replicaCount: 2
  service:
    port: 3000

backend:
  image:
    repository: todo-chatbot-backend
    tag: latest
    pullPolicy: Never
  replicaCount: 2
  service:
    port: 8000
```
