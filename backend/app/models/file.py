from sqlalchemy import Integer, String, DateTime, ForeignKey, BigInteger, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class File(Base):
    __tablename__ = "files"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    original_filename: Mapped[str] = mapped_column(String(255), nullable=False)
    stored_filename: Mapped[str] = mapped_column(String(255), nullable=False)
    file_type: Mapped[str] = mapped_column(String(50), nullable=False)
    file_size: Mapped[int] = mapped_column(BigInteger, nullable=False)
    storage_path: Mapped[str] = mapped_column(String(500), nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, default=func.now())
    
    document = relationship("Document", back_populates="file", uselist=False, cascade="all, delete-orphan")