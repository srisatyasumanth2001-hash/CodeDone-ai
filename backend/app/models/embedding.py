from sqlalchemy import Integer, ForeignKey, Text, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from pgvector.sqlalchemy import Vector
from app.core.database import Base

class Embedding(Base):
    __tablename__ = "embeddings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    document_id: Mapped[int] = mapped_column(Integer, ForeignKey("documents.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    chunk_text: Mapped[str] = mapped_column(Text, nullable=False)
    chunk_index: Mapped[int] = mapped_column(Integer, nullable=False)  # position in document
    embedding: Mapped[list] = mapped_column(Vector(1536), nullable=False)  # pgvector column
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=func.now())