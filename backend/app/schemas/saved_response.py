from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class SaveResponseRequest(BaseModel):
    message_id: int
    content: str
    conversation_title: Optional[str] = None
    note: Optional[str] = None


class SavedResponseResponse(BaseModel):
    id: int
    content: str
    conversation_title: Optional[str]
    note: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True