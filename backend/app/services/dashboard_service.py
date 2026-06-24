from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
import tiktoken

from app.models.conversation import Conversation
from app.models.message import Message
from app.models.file import File
from app.models.document import Document
from app.models.embedding import Embedding
from app.models.repository import Repository

encoder = tiktoken.encoding_for_model("gpt-4o")

def estimate_tokens_used(db: Session, user_id:int)-> int:
    messages=(
        db.query(Message.content)
        .join(Conversation, Message.conversation_id== Conversation.id)
        .filter(Conversation.user_id== user_id)
        .all()
    )
    total =0
    for (content,) in messages:
        total+= len(encoder.encode(content))
    return total

def get_daily_activity(db: Session, user_id: int, days:int = 14) -> list[dict]:
    since = datetime.utcnow() - timedelta(days=days)
    results =(
        db.query(
            func.date(Message.created_at).label("day"),
            func.count(Message.id).label("count")
        )
        .join(Conversation, Message.conversation_id == Conversation.id)
        .filter(
            Conversation.user_id == user_id,
            Message.created_at >= since,
            Message.role == "user"
        )
        .group_by(func.date(Message.created_at))
        .order_by(func.date(Message.created_at))
        .all()
    )
    activity_map = {str(day): count for day, count in results}
    activity =[]
    for i in range(days):
        date = (since + timedelta(days=i)).date()
        datestr = str(date)
        activity.append({
            "date": datestr,
            "messages" : activity_map.get(datestr, 0)
        })
    return activity

def get_dashboard_stats(db: Session, user_id:int) -> dict:
    total_conversations =(
        db.query(Conversation).filter(Conversation.user_id== user_id).count()
    )

    total_messages =(
        db.query(Message)
        .join(Conversation, Message.conversation_id== Conversation.id)
        .filter(Conversation.user_id== user_id, Message.role=="user")
        .count()
    )
    total_files = db.query(File).filter(File.user_id== user_id).count()
    uploaded_documents =(
        db.query(Document)
        .filter(Document.user_id==user_id, Document.source_type=="upload")
        .count()
    )
    repository_files =(
        db.query(Document)
        .filter(Document.user_id== user_id, Document.source_type== "repository")
        .count()
    )
    total_repositories =(
        db.query(Repository).filter(Repository.user_id== user_id).count()
    )
    total_embedded_chunks=(
        db.query(Embedding).filter(Embedding.user_id == user_id).count()
    )
    estimated_tokens = estimate_tokens_used(db, user_id)
    daily_activity = get_daily_activity(db, user_id)
    return {
        "total_conversations": total_conversations,
        "total_messages": total_messages,
        "total_files": total_files,
        "uploaded_documents": uploaded_documents,
        "repository_files": repository_files,
        "total_repositories": total_repositories,
        "total_embedded_chunks": total_embedded_chunks,
        "estimated_tokens_used": estimated_tokens,
        "daily_activity": daily_activity,
    }
