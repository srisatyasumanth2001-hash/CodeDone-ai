from pydantic import BaseModel


class DailyActivity(BaseModel):
    date: str
    messages: int


class DashboardStatsResponse(BaseModel):
    total_conversations: int
    total_messages: int
    total_files: int
    uploaded_documents: int
    repository_files: int
    total_repositories: int
    total_embedded_chunks: int
    estimated_tokens_used: int
    daily_activity: list[DailyActivity]