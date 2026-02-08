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
def create_task(
    user_id: str,
    task_in: TaskCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    validate_user_access(user_id, current_user)
    return task_service.create_task(session, task_in, current_user.id)

@router.get("/users/{user_id}/tasks", response_model=List[TaskRead])
def read_tasks(
    user_id: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
    search: Optional[str] = None,
    priority: Optional[str] = None,
    status: Optional[str] = "todo",
    sort_by: Optional[str] = None,
    tag: Optional[str] = None
):
    validate_user_access(user_id, current_user)
    return task_service.get_tasks(session, current_user.id, search, priority, status, sort_by, tag)

@router.get("/users/{user_id}/tasks/{task_id}", response_model=TaskRead)
def read_task(
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
def update_task(
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
    return task_service.update_task(session, task, task_in)

@router.patch("/users/{user_id}/tasks/{task_id}/complete", response_model=TaskRead)
def complete_task(
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
    return task

@router.delete("/users/{user_id}/tasks/{task_id}")
def delete_task(
    user_id: str,
    task_id: uuid.UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    validate_user_access(user_id, current_user)
    task = task_service.get_task(session, task_id, current_user.id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task_service.delete_task(session, task)
    return {"ok": True}
