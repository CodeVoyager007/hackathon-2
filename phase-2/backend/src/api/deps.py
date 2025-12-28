from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select
from src.core.db import get_session
from src.models.auth import User, Session as UserSession
from datetime import datetime

# OAuth2PasswordBearer extracts the Bearer token from the header
reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl="" 
)

def get_current_user(
    session: Session = Depends(get_session),
    token: str = Depends(reusable_oauth2)
) -> User:
    # 1. Lookup session in DB
    # This token is the opaque session token from Better Auth
    # This method is robust and works with Better Auth's default configuration
    db_session = session.exec(select(UserSession).where(UserSession.token == token)).first()
    
    if not db_session:
        print(f"DEBUG: Session token not found in DB: {token[:10]}...")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session token",
        )
        
    # 2. Check expiration
    if db_session.expiresAt < datetime.utcnow():
        print(f"DEBUG: Session expired at {db_session.expiresAt}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired",
        )
        
    # 3. Get User
    user = session.get(User, db_session.userId)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return user
