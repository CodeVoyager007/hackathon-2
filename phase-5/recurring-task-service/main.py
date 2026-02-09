from fastapi import FastAPI, Request
import uvicorn
import httpx
import logging
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta

app = FastAPI(title="Recurring Task Service")
logger = logging.getLogger(__name__)

DAPR_URL = "http://localhost:3500/v1.0"
PUBSUB_NAME = "kafka-pubsub"
TOPIC_TASKS = "task-events"

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/dapr/subscribe")
def subscribe():
    subscriptions = [
        {
            "pubsubname": PUBSUB_NAME,
            "topic": TOPIC_TASKS,
            "route": "/task-handler"
        }
    ]
    return subscriptions

@app.post("/task-handler")
async def handle_task_event(request: Request):
    """Handle task events from Dapr Pub/Sub."""
    event = await request.json()
    event_type = event.get("data", {}).get("event_type")
    
    if event_type != "task.completed":
        return {"status": "ignored"}

    task_data = event.get("data", {}).get("task_data", {})
    recurrence = task_data.get("recurrence")
    
    if not recurrence or recurrence.get("pattern") == "none":
        return {"status": "no_recurrence"}

    # Calculate next due date
    due_date_str = task_data.get("due_date")
    if not due_date_str:
        return {"status": "no_due_date"}

    due_date = datetime.fromisoformat(due_date_str.replace("Z", "+00:00"))
    pattern = recurrence.get("pattern")
    interval = recurrence.get("interval", 1)

    next_due = due_date
    if pattern == "daily":
        next_due += timedelta(days=interval)
    elif pattern == "weekly":
        next_due += timedelta(weeks=interval)
    elif pattern == "monthly":
        next_due += relativedelta(months=interval)
    elif pattern == "yearly":
        next_due += relativedelta(years=interval)
    
    # Create next task via Dapr Service Invocation
    user_id = task_data.get("user_id") or event.get("data", {}).get("user_id")
    url = f"{DAPR_URL}/invoke/backend-service/method/api/users/{user_id}/tasks"
    
    new_task = {
        "title": task_data.get("title"),
        "description": task_data.get("description"),
        "priority": task_data.get("priority"),
        "tags": task_data.get("tags"),
        "due_date": next_due.isoformat(),
        "recurrence": recurrence,
        "completed": False
    }

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(url, json=new_task)
            if resp.status_code not in [200, 201]:
                logger.error(f"Failed to create next recurring task: {resp.text}")
    except Exception as e:
        logger.error(f"Error invoking backend for next task: {e}")

    return {"status": "success"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8002)
