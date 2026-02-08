# Quickstart: Phase 5 Distributed Development

## Prerequisites

1. **Docker Desktop** (running)
2. **Minikube** (`minikube start --cpus 4 --memory 8192`)
3. **Helm** (`brew install helm` or choco)
4. **Dapr CLI** (`wget -q https://raw.githubusercontent.com/dapr/cli/master/install/install.sh -O - | /bin/bash`)
5. **kubectl**

## Setup Local Environment

1. **Initialize Dapr on K8s**:
   ```bash
   dapr init -k
   dapr status -k # Verify control plane
   ```

2. **Install Kafka (Strimzi)**:
   ```bash
   kubectl create namespace kafka
   kubectl create -f 'https://strimzi.io/install/latest?namespace=kafka' -n kafka
   kubectl apply -f deploy/helm/templates/dapr-components/kafka-cluster.yaml -n kafka
   ```

3. **Deploy Application**:
   ```bash
   # Build images (if local registry) or use placeholders
   eval $(minikube docker-env)
   docker build -t todo-backend:latest ./backend
   docker build -t todo-frontend:latest ./frontend
   docker build -t notification-service:latest ./notification-service
   docker build -t recurring-task-service:latest ./recurring-task-service
   
   # Install Helm Chart
   helm install todo-app ./deploy/helm -f ./deploy/helm/values-dev.yaml
   ```

4. **Verify Deployment**:
   ```bash
   kubectl get pods
   # Expect:
   # backend-xxx (2/2) -> App + Dapr Sidecar
   # frontend-xxx (2/2) -> App + Dapr Sidecar
   # notification-xxx (2/2)
   # recurring-xxx (2/2)
   ```

5. **Access Application**:
   ```bash
   minikube service todo-frontend-service
   ```

## Testing Events

1. **Tail Dapr Logs**:
   ```bash
   kubectl logs -l app=backend -c daprd -f
   ```

2. **Trigger Event**:
   - Create a task in UI with "High" priority.
   - Watch logs for `Publishing event to topic: task-events`.

3. **Verify Consumption**:
   ```bash
   kubectl logs -l app=recurring-task-service -c app -f
   ```
