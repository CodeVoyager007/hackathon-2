from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid
from src.models.task import Priority, Recurrence

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: Priority = Priority.medium
    due_date: Optional[datetime] = None
    tags: List[str] = []
    recurrence: Recurrence = Recurrence.none
    reminder_at: Optional[datetime] = None
    is_completed: bool = False

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[Priority] = None
    due_date: Optional[datetime] = None
    tags: Optional[List[str]] = None
    recurrence: Optional[Recurrence] = None
    reminder_at: Optional[datetime] = None
    is_completed: Optional[bool] = None

class TaskRead(TaskBase):
    id: uuid.UUID
    owner_id: str
    created_at: datetime
    updated_at: datetime
