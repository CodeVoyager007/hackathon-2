from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session
from src.core.db import get_session
from src.services.chat_service import ChatService
from pydantic import BaseModel
from typing import Optional, List, Any
import uuid

router = APIRouter()

class ChatRequest(BaseModel):
    conversation_id: Optional[uuid.UUID] = None
    message: str

class ChatResponse(BaseModel):
    conversation_id: uuid.UUID
    response: str
    tool_calls: List[Any]

@router.post("/{user_id}/chat", response_model=ChatResponse)
async def chat(
    user_id: str, 
    request: ChatRequest, 
    session: Session = Depends(get_session)
):
    service = ChatService(session)
    response_text, conv_id, tool_calls = await service.process_message(
        user_id, 
        request.message, 
        request.conversation_id
    )
    return ChatResponse(
        response=response_text, 
        conversation_id=conv_id,
        tool_calls=tool_calls
    )