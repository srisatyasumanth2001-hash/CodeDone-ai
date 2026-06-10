from sqlalchemy import Integer, String, DateTime, ForeignKey,Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class Message(Base):
    __tablename__ = "messages"  # this is the actual table name in PostgreSQL

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    conversation_id : Mapped[int] = mapped_column(Integer, ForeignKey("conversations.id"), nullable=False)
    role : Mapped[str] = mapped_column(String(20), nullable=False)
    content: Mapped[str]= mapped_column(Text, nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=func.now())

    conversations = relationship("Conversation", back_populates="messages")