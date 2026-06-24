from pydantic import BaseModel
from datetime import datetime


class ConversationResult(BaseModel):
    id: int
    title: str
    created_at: datetime
    class Config:
        from_attributes = True


class FileResult(BaseModel):
    id: int
    original_filename: str
    class Config:
        from_attributes = True


class RepositoryResult(BaseModel):
    id: int
    owner: str
    repo_name: str
    class Config:
        from_attributes = True


class GlobalSearchResponse(BaseModel):
    conversations: list[ConversationResult]
    files: list[FileResult]
    repositories: list[RepositoryResult]