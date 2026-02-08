# Update Task model to use string ID for owner to match Better Auth
import uuid
from sqlmodel import Field, SQLModel, Column
from typing import Optional, List
from datetime import datetime
from enum import Enum
from sqlalchemy import JSON

class Priority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

class Recurrence(str, Enum):
    none = "none"
    daily = "daily"
    weekly = "weekly"
    monthly = "monthly"
    yearly = "yearly"

class Task(SQLModel, table=True):
    __tablename__ = "tasks"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(max_length=255)
    description: Optional[str] = Field(default=None)
    priority: str = Field(default=Priority.medium.value)
    due_date: Optional[datetime] = Field(default=None)
    
    tags: List[str] = Field(default=[], sa_column=Column(JSON))
    recurrence: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    
    completed: bool = Field(default=False)
    # Renamed to user_id to match Phase III Spec
    user_id: str = Field(foreign_key="user.id", index=True) 
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Reminder(SQLModel, table=True):
    __tablename__ = "reminders"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    task_id: uuid.UUID = Field(foreign_key="tasks.id")
    due_at: datetime
    remind_at: datetime
    sent: bool = Field(default=False)
    job_name: str = Field(unique=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

