from fastapi import APIRouter
from src.api.routes import health, auth, tasks, chat

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
# Include tasks router at root /api level (paths already have /api/{user_id}/tasks)
api_router.include_router(tasks.router, tags=["tasks"]) 
api_router.include_router(chat.router, tags=["chat"]) 
