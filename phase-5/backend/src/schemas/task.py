from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid
from src.models.task import Priority, Recurrence

class RecurrencePattern(BaseModel):
    pattern: Recurrence
    interval: int = 1

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: Priority = Priority.medium
    due_date: Optional[datetime] = None
    tags: List[str] = []
    recurrence: Optional[RecurrencePattern] = None
    completed: bool = False

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[Priority] = None
    due_date: Optional[datetime] = None
    tags: Optional[List[str]] = None
    recurrence: Optional[RecurrencePattern] = None
    completed: Optional[bool] = None


class TaskRead(TaskBase):
    id: uuid.UUID
    user_id: str
    created_at: datetime
    updated_at: datetime