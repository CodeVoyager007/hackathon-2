from fastapi import APIRouter, Depends
from src.api.deps import get_current_user
from src.models.auth import User

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "ok"}

@router.get("/health-auth")
def health_check_auth(current_user: User = Depends(get_current_user)):
    return {"status": "ok", "user": current_user.email}