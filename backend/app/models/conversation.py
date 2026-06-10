from sqlalchemy import Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class Conversation(Base):
    __tablename__ = "conversations"  # this is the actual table name in PostgreSQL

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id : Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    title : Mapped[str] = mapped_column(String(255), default="New Conversation")
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=func.now())

    messages = relationship("Message", back_populates="conversations", cascade="all, delete-orphan")