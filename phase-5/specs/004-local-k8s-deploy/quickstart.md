# Quickstart: Phase 4 Local Kubernetes Deployment

## Prerequisites

1.  **Docker Desktop** (running)
2.  **Minikube** installed (`choco install minikube` or equivalent)
3.  **Helm** installed (`choco install kubernetes-helm`)
4.  **kubectl** installed

## 1. Start Minikube

Start Minikube and point your shell to Minikube's Docker daemon. This allows you to build images directly inside Minikube without pushing to a registry.

```bash
minikube start
# Powershell
& minikube -p minikube docker-env --shell powershell | Invoke-Expression
# Bash
eval $(minikube -p minikube docker-env)
```

## 2. Build Images

Build the frontend and backend images.

```bash
# Frontend
cd frontend
docker build -t todo-chatbot-frontend:latest .

# Backend
cd ../backend
docker build -t todo-chatbot-backend:latest .
```

## 3. Configure Secrets

Create a `my-secrets.yaml` file (DO NOT COMMIT THIS) with your keys:

```yaml
secrets:
  databaseUrl: "postgres://..."
  openaiApiKey: "sk-..."
  geminiApiKey: "..."
  betterAuthSecret: "your-secret-..."
```

### Required Environment Variables

#### Backend (`backend/.env`)
- `DATABASE_URL`: Connection string for Neon PostgreSQL.
- `BETTER_AUTH_SECRET`: Secret key for authentication.
- `GEMINI_API_KEY`: API key for Gemini.
- `GEMINI_BASE_URL`: (Optional) Custom base URL for Gemini proxy.
- `CORS_ORIGINS`: Comma-separated list of allowed origins.

#### Frontend (`frontend/.env`)
- `NEXT_PUBLIC_API_URL`: URL of the Backend API.
- `BETTER_AUTH_SECRET`: Secret key for authentication (must match Backend).
- `BETTER_AUTH_URL`: URL of the Frontend application.

## 4. Deploy via Helm

Install the chart.

```bash
cd ../deploy/helm
helm install todo-app ./todo-chatbot -f ../../my-secrets.yaml
```

## 5. Access the Application

Get the service URL:

```bash
minikube service todo-frontend-service --url
```

Open that URL in your browser.

## 6. AIOps Tools

### kubectl-ai
Run kubectl-ai for ad-hoc queries and operations using natural language:

```bash
# Scaling
kubectl-ai "Scale the frontend deployment to 3 replicas"

# Troubleshooting
kubectl-ai "Why is the backend pod in CrashLoopBackOff?"

# Exploration
kubectl-ai "List all services in the todo-chatbot namespace"
```

### kagent
kagent provides intelligent cluster analysis. If installed, you can use it to get health reports:

```bash
# Analyze cluster health
kagent analyze --namespace todo-chatbot

# Optimize resources
kagent recommend --deployment todo-chatbot-backend
```

## Troubleshooting

- **ImagePullBackOff**: Ensure you ran the `docker-env` command before building images.
- **CrashLoopBackOff**: Check logs with `kubectl logs <pod-name>`. Usually missing env vars.
- **Database Connection**: Ensure the Neon DB URL is correct and allows connections from your IP (or Minikube's IP).
