from sqlalchemy.orm import Session
from app.models.conversation import Conversation
from app.models.message import Message
from app.models.file import File
from app.models.repository import Repository


def search_everything(db: Session, user_id: int, query: str) -> dict:
    """
    Simple literal text search across conversations, files, and
    repositories. Not semantic — exact substring matching only.
    Limited to 10 results per category to keep the dropdown readable.
    """
    pattern = f"%{query}%"

    # Conversations matching by title OR by any message content inside them
    matching_conversations = (
        db.query(Conversation)
        .filter(Conversation.user_id == user_id)
        .filter(
            Conversation.title.ilike(pattern) |
            Conversation.id.in_(
                db.query(Message.conversation_id)
                .filter(Message.content.ilike(pattern))
            )
        )
        .order_by(Conversation.created_at.desc())
        .limit(10)
        .all()
    )

    matching_files = (
        db.query(File)
        .filter(File.user_id == user_id, File.original_filename.ilike(pattern))
        .order_by(File.created_at.desc())
        .limit(10)
        .all()
    )

    matching_repos = (
        db.query(Repository)
        .filter(
            Repository.user_id == user_id,
            (Repository.repo_name.ilike(pattern) | Repository.owner.ilike(pattern))
        )
        .order_by(Repository.created_at.desc())
        .limit(10)
        .all()
    )

    return {
        "conversations": matching_conversations,
        "files": matching_files,
        "repositories": matching_repos,
    }