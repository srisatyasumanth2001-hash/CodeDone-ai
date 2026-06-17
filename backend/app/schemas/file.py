from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class FileResponse(BaseModel):
    id: int
    original_filename: str
    file_type: str
    file_size: int
    created_at: datetime

    class Config:
        from_attributes = True


class FileDetailResponse(BaseModel):
    id: int
    original_filename: str
    file_type: str
    file_size: int
    created_at: datetime
    word_count: Optional[int] = None

    class Config:
        from_attributes = True


class UploadResponse(BaseModel):
    file_id: int
    filename: str
    file_type: str
    file_size: int
    word_count: int
    message: str

class FileChatRequest(BaseModel):
    message: str
    conversation_id: int | None = None