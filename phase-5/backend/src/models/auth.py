from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime
from sqlalchemy import text
import uuid

# ... (User, Session, Account, Verification models are unchanged) ...

class User(SQLModel, table=True):
    __tablename__ = "user"
    id: str = Field(primary_key=True)
    name: str
    email: str = Field(unique=True, index=True)
    emailVerified: bool = Field(default=False)
    image: Optional[str] = Field(default=None)
    createdAt: datetime
    updatedAt: datetime
    
    sessions: List["Session"] = Relationship(back_populates="user")
    accounts: List["Account"] = Relationship(back_populates="user")

class Session(SQLModel, table=True):
    __tablename__ = "session"
    id: str = Field(primary_key=True)
    userId: str = Field(foreign_key="user.id", index=True)
    token: str = Field(unique=True, index=True)
    expiresAt: datetime
    ipAddress: Optional[str] = None
    userAgent: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime
    
    user: User = Relationship(back_populates="sessions")

class Account(SQLModel, table=True):
    __tablename__ = "account"
    id: str = Field(primary_key=True)
    userId: str = Field(foreign_key="user.id")
    accountId: str
    providerId: str
    accessToken: Optional[str] = None
    refreshToken: Optional[str] = None
    accessTokenExpiresAt: Optional[datetime] = None
    refreshTokenExpiresAt: Optional[datetime] = None
    scope: Optional[str] = None
    idToken: Optional[str] = None
    password: Optional[str] = None
    createdAt: datetime
    updatedAt: datetime
    
    user: User = Relationship(back_populates="accounts")

class Verification(SQLModel, table=True):
    __tablename__ = "verification"
    id: str = Field(primary_key=True)
    identifier: str
    value: str
    expiresAt: datetime
    createdAt: datetime
    updatedAt: datetime

# Final JWKS model with DATABASE-LEVEL defaults
class JWKS(SQLModel, table=True):
    __tablename__ = "jwks"
    id: str = Field(primary_key=True)
    publicKey: str
    privateKey: str
    # Use sa_column_kwargs to set server_default for Postgres
    createdAt: datetime = Field(sa_column_kwargs={"server_default": text("CURRENT_TIMESTAMP")})
    updatedAt: datetime = Field(sa_column_kwargs={"server_default": text("CURRENT_TIMESTAMP")})