from fastapi import FastAPI, Request
import uvicorn
import httpx
import logging
import os

app = FastAPI(title="Notification Service")
logger = logging.getLogger(__name__)

DAPR_URL = "http://localhost:3500/v1.0"
PUBSUB_NAME = "kafka-pubsub"
TOPIC_REMINDERS = "reminders"

@app.get("/health")
def health():
    return {"status": "ok"}

# Dapr Subscription
@app.get("/dapr/subscribe")
def subscribe():
    subscriptions = [
        {
            "pubsubname": PUBSUB_NAME,
            "topic": TOPIC_REMINDERS,
            "route": "/notifications"
        }
    ]
    return subscriptions

@app.post("/notifications")
async def handle_notification_event(request: Request):
    """Handle reminder event from Dapr Pub/Sub."""
    event = await request.json()
    data = event.get("data", {})
    logger.info(f"RECEIVED NOTIFICATION EVENT: {data}")
    
    # Simulate sending push notification
    title = data.get("title", "Task Due")
    user_id = data.get("user_id", "unknown")
    print(f"--- [PUSH NOTIFICATION] To: {user_id} | Title: {title} ---")
    
    return {"status": "success"}

@app.post("/api/jobs/trigger")
async def handle_job_trigger(request: Request):
    """Callback for Dapr Jobs API when a reminder is due."""
    job_data = await request.json()
    logger.info(f"JOB TRIGGERED: {job_data}")
    
    # job_data structure from schedule_reminder_job data field
    data = job_data.get("data", {})
    
    # Publish to reminders topic so multiple instances of notification service 
    # could potentially handle different delivery channels (email, push, etc.)
    url = f"{DAPR_URL}/publish/{PUBSUB_NAME}/{TOPIC_REMINDERS}"
    try:
        async with httpx.AsyncClient() as client:
            await client.post(url, json=data)
    except Exception as e:
        logger.error(f"Failed to publish reminder from job trigger: {e}")

    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
