from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session
from src.core.db import get_session
from src.api.deps import get_current_user
from src.models.auth import User
from src.schemas.task import TaskCreate, TaskRead, TaskUpdate
from src.services import task_service
from typing import Optional, List
import uuid

router = APIRouter()

def validate_user_access(user_id: str, current_user: User):
    if user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this user's data")

# Changed routes to start with /users/
@router.post("/users/{user_id}/tasks", response_model=TaskRead)
async def create_task(
    user_id: str,
    task_in: TaskCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    validate_user_access(user_id, current_user)
    task = task_service.create_task(session, task_in, current_user.id)
    
    # Async actions
    await task_service.publish_event_to_dapr("task.created", task)
    if task.due_date:
        await task_service.schedule_reminder_job(task)
        
    return task

@router.get("/users/{user_id}/tasks", response_model=List[TaskRead])
async def read_tasks(
    user_id: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
    search: Optional[str] = None,
    priority: Optional[str] = None,
    status: Optional[str] = "pending",
    sort_by: Optional[str] = None,
    tag: Optional[str] = None
):
    validate_user_access(user_id, current_user)
    return task_service.get_tasks(session, current_user.id, search, priority, status, sort_by, tag)

@router.get("/users/{user_id}/tasks/{task_id}", response_model=TaskRead)
async def read_task(
    user_id: str,
    task_id: uuid.UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    validate_user_access(user_id, current_user)
    task = task_service.get_task(session, task_id, current_user.id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/users/{user_id}/tasks/{task_id}", response_model=TaskRead)
async def update_task(
    user_id: str,
    task_id: uuid.UUID,
    task_in: TaskUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    validate_user_access(user_id, current_user)
    task = task_service.get_task(session, task_id, current_user.id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Check if due date changed
    old_due_date = task.due_date
    updated_task = task_service.update_task(session, task, task_in)
    
    # Async actions
    await task_service.publish_event_to_dapr("task.updated", updated_task)
    if updated_task.due_date != old_due_date:
        await task_service.cancel_reminder_job(updated_task.id)
        if updated_task.due_date:
            await task_service.schedule_reminder_job(updated_task)
            
    return updated_task

@router.patch("/users/{user_id}/tasks/{task_id}/complete", response_model=TaskRead)
async def complete_task(
    user_id: str,
    task_id: uuid.UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    validate_user_access(user_id, current_user)
    task = task_service.get_task(session, task_id, current_user.id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task.completed = not task.completed
    session.add(task)
    session.commit()
    session.refresh(task)
    
    # Async actions
    event_type = "task.completed" if task.completed else "task.updated"
    await task_service.publish_event_to_dapr(event_type, task)
    if task.completed:
        await task_service.cancel_reminder_job(task.id)
    
    return task

@router.delete("/users/{user_id}/tasks/{task_id}")
async def delete_task(
    user_id: str,
    task_id: uuid.UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    validate_user_access(user_id, current_user)
    task = task_service.get_task(session, task_id, current_user.id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    await task_service.publish_event_to_dapr("task.deleted", task)
    await task_service.cancel_reminder_job(task.id)
    
    task_service.delete_task(session, task)
    return {"ok": True}
