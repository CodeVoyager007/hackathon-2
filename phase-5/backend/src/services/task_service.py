from sqlmodel import Session, select, col, func
from src.models.task import Task, Recurrence
from src.schemas.task import TaskCreate, TaskUpdate
from typing import Optional, List
from datetime import datetime, timedelta
import uuid

import httpx
import logging

DAPR_URL = "http://localhost:3500/v1.0"
PUBSUB_NAME = "kafka-pubsub"
TOPIC_TASKS = "task-events"

logger = logging.getLogger(__name__)

async def publish_event_to_dapr(event_type: str, task: Task):
    """Publish task event to Kafka via Dapr Pub/Sub."""
    url = f"{DAPR_URL}/publish/{PUBSUB_NAME}/{TOPIC_TASKS}"
    payload = {
        "event_type": event_type,
        "timestamp": datetime.utcnow().isoformat(),
        "user_id": task.user_id,
        "task_id": str(task.id),
        "task_data": {
            "id": str(task.id),
            "title": task.title,
            "completed": task.completed,
            "priority": task.priority,
            "tags": task.tags,
            "due_date": task.due_date.isoformat() if task.due_date else None,
            "recurrence": task.recurrence
        }
    }
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(url, json=payload)
            if resp.status_code != 204:
                logger.error(f"Failed to publish event {event_type}: {resp.text}")
    except Exception as e:
        logger.error(f"Error publishing event {event_type}: {e}")

async def schedule_reminder_job(task: Task):
    """Schedule a reminder job using Dapr Jobs API."""
    if not task.due_date:
        return
    
    # Example: remind 30 mins before
    remind_at = task.due_date - timedelta(minutes=30)
    if remind_at < datetime.utcnow():
        return

    job_name = f"reminder-{task.id}"
    url = f"{DAPR_URL}-alpha1/jobs/{job_name}"
    
    payload = {
        "dueTime": remind_at.isoformat() + "Z", # Dapr expects RFC3339
        "data": {
            "task_id": str(task.id),
            "user_id": task.user_id,
            "title": task.title
        }
    }
    
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(url, json=payload)
            if resp.status_code not in [200, 204]:
                logger.error(f"Failed to schedule job {job_name}: {resp.text}")
    except Exception as e:
        logger.error(f"Error scheduling job {job_name}: {e}")

async def cancel_reminder_job(task_id: uuid.UUID):
    """Cancel a scheduled reminder job."""
    job_name = f"reminder-{task_id}"
    url = f"{DAPR_URL}-alpha1/jobs/{job_name}"
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.delete(url)
            if resp.status_code not in [200, 204, 404]:
                logger.error(f"Failed to cancel job {job_name}: {resp.text}")
    except Exception as e:
        logger.error(f"Error cancelling job {job_name}: {e}")

def create_task(session: Session, task_in: TaskCreate, user_id: str) -> Task:
    task = Task.model_validate(task_in, update={"user_id": user_id})
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

def get_tasks(
    session: Session, 
    user_id: str, 
    search: Optional[str] = None,
    priority: Optional[str] = None,
    status: Optional[str] = None, 
    sort_by: Optional[str] = None, 
    tag: Optional[str] = None
) -> List[Task]:
    statement = select(Task).where(Task.user_id == user_id)
    
    # Filtering
    if search:
        # Search in title or description
        statement = statement.where(
            col(Task.title).ilike(f"%{search}%") | col(Task.description).ilike(f"%{search}%")
        )
    
    if priority and priority != "all":
        statement = statement.where(Task.priority == priority)
    
    if status:
        if status == "pending":
            statement = statement.where(Task.completed == False)
        elif status == "completed":
            statement = statement.where(Task.completed == True)
    
    if tag:
        # Simple tag check using SQLModel/SQLAlchemy JSON operators if supported, 
        # or ilike for array-like text. Since we used JSON column:
        statement = statement.where(Task.tags.contains(tag))

    # Sorting
    if sort_by == "due_date_asc":
        # Nulls last for due date
        statement = statement.order_by(col(Task.due_date).asc().nulls_last())
    elif sort_by == "priority_desc":
        # Custom priority order (high > medium > low)
        # We can use a CASE statement in SQLAlchemy
        from sqlalchemy import case
        priority_order = case(
            (Task.priority == "high", 1),
            (Task.priority == "medium", 2),
            (Task.priority == "low", 3),
            else_=4
        )
        statement = statement.order_by(priority_order)
    elif sort_by == "title_asc":
        statement = statement.order_by(Task.title.asc())
    else: # Default: created_at_desc
        statement = statement.order_by(Task.created_at.desc())

    return session.exec(statement).all()

def get_task(session: Session, task_id: uuid.UUID, user_id: str) -> Optional[Task]:
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    return session.exec(statement).first()

def update_task(session: Session, db_task: Task, task_in: TaskUpdate) -> Task:
    task_in_data = task_in.model_dump(exclude_unset=True)

    # Recurrence logic is now handled by Recurring Task Service via events.
    # We just update the task state here.

    db_task.sqlmodel_update(task_in_data)
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

def delete_task(session: Session, db_task: Task):
    session.delete(db_task)
    session.commit()