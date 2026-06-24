from pydantic import BaseModel
from datetime import datetime
from typing import List

class MessageResponse(BaseModel):
    id: int
    role: str
    content: str
    created_at: datetime
    is_saved: bool = False

    class Config:
        from_attributes = True

class ConversationResponse(BaseModel):
    id: int
    title: str
    created_at: datetime

    class Config:
        from_attributes = True

class ConversationDetailResponse(BaseModel):
    id: int
    title: str
    created_at: datetime
    messages: List[MessageResponse] = []

    class Config:
        from_attributes = True

class SendMessageRequest(BaseModel):
    conversation_id: int | None = None  # None means start a new conversation
    message: str