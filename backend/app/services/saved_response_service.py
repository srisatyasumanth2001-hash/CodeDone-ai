from sqlalchemy.orm import Session
from app.models.saved_response import SavedResponse


def save_response(db: Session, user_id: int, data: dict) -> SavedResponse:
    saved = SavedResponse(
        user_id=user_id,
        message_id=data.get("message_id"),
        content=data["content"],
        conversation_title=data.get("conversation_title"),
        note=data.get("note")
    )
    db.add(saved)
    db.commit()
    db.refresh(saved)
    return saved


def get_saved_responses(db: Session, user_id: int):
    return (
        db.query(SavedResponse)
        .filter(SavedResponse.user_id == user_id)
        .order_by(SavedResponse.created_at.desc())
        .all()
    )


def delete_saved_response(db: Session, saved_id: int, user_id: int) -> bool:
    saved = (
        db.query(SavedResponse)
        .filter(SavedResponse.id == saved_id, SavedResponse.user_id == user_id)
        .first()
    )
    if not saved:
        return False
    db.delete(saved)
    db.commit()
    return True