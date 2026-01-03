import uuid
from datetime import datetime
from enum import Enum
from typing import List, Optional
from sqlmodel import Field, SQLModel, Relationship, Column
from sqlalchemy import Text

class Role(str, Enum):
    user = "user"
    assistant = "assistant"
    system = "system"

class Conversation(SQLModel, table=True):
    __tablename__ = "conversations"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    messages: List["Message"] = Relationship(back_populates="conversation")

class Message(SQLModel, table=True):
    __tablename__ = "messages"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: str = Field(index=True) # Added to match spec
    conversation_id: uuid.UUID = Field(foreign_key="conversations.id", index=True)
    role: str = Field(default=Role.user.value)
    content: str = Field(sa_column=Column(Text))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    conversation: Conversation = Relationship(back_populates="messages")