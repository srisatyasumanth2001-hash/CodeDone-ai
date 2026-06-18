from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SearchRequest(BaseModel):
    query: str
    document_id: Optional[int] = None  # None = search across ALL user documents
    top_k: int = 5                     # how many chunks to retrieve


class ChunkResult(BaseModel):
    chunk_text: str
    similarity: float
    document_id: int