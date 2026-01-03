from fastapi import APIRouter, Depends, HTTPException
from src.api.deps import get_current_user
from src.models.auth import User
from src.models.task import Task
from sqlmodel import Session, select, func
from src.core.db import get_session
from pydantic import BaseModel
from typing import Optional
import uuid

router = APIRouter()

class UserRead(BaseModel):
    id: str
    email: str
    name: str
    image: Optional[str] = None

class UserStats(BaseModel):
    total_tasks: int
    completed_tasks: int
    pending_tasks: int

@router.get("/me", response_model=UserRead)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.get("/{user_id}/stats", response_model=UserStats)
def read_user_stats(
    user_id: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    if user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    total = session.exec(select(func.count(Task.id)).where(Task.owner_id == user_id)).one()
    completed = session.exec(select(func.count(Task.id)).where(Task.owner_id == user_id, Task.is_completed == True)).one()
    
    return {
        "total_tasks": total,
        "completed_tasks": completed,
        "pending_tasks": total - completed
    }