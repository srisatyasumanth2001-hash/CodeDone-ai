from sqlalchemy import Integer, String, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class SavedResponse(Base):
    __tablename__ = "saved_responses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)

    # message_id kept for reference, but nullable — the bookmark must
    # survive even if the original message/conversation is later deleted
    message_id: Mapped[int] = mapped_column(Integer, nullable=True)

    # Denormalized snapshot — this is what actually gets displayed,
    # independent of whether the source still exists
    content: Mapped[str] = mapped_column(Text, nullable=False)
    conversation_title: Mapped[str] = mapped_column(String(255), nullable=True)
    note: Mapped[str] = mapped_column(String(500), nullable=True)

    created_at: Mapped[DateTime] = mapped_column(DateTime, default=func.now())