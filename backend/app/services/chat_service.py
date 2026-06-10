from sqlalchemy.orm import Session
from app.models.conversation import Conversation
from app.models.message import Message
from app.services.ai_service import get_ai_response, generate_conversation_title

def create_conversation(db: Session, user_id:int, title: str= "New Conversation"):
    conversation = Conversation(user_id=user_id, title = title)
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return conversation

def get_conversation_by_user(db: Session, user_id:int):
    return(
        db.query(Conversation).filter(Conversation.user_id==user_id).
        order_by(Conversation.created_at.desc()).all()
    )

def get_conversation_by_id(db:Session, conversation_id: int, user_id: int):
    return(
        db.query(Conversation).
        filter(
            Conversation.id == conversation_id,
            Conversation.user_id== user_id
        )
        .first()
    )

def update_conversation_title(db:Session, conversation_id: int, title:str):
    conversation = db.query(Conversation).filter(Conversation.id== conversation_id).first()
    if conversation:
        conversation.title = title
        db.commit()
    return conversation

def delete_conversation(db:Session, conversation_id: int):
    conversation = db.query(Conversation).filter(Conversation.id== conversation_id).first()
    if conversation:
        db.delete(conversation)
        db.commit()
    
def save_message(db:Session, conversation_id:int, role:str, content:str):
    message = Message(
        conversation_id= conversation_id,
        role=role,
        content = content
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message
def get_message_by_conversation(db: Session, conversation_id:int):
    return(
        db.query(Message).filter(Message.conversation_id==conversation_id).
        order_by(Message.created_at.asc()).all()
    )

def send_message_and_get_response(
        db: Session,
        user_id: int,
        user_message:str,
        conversation_id:int | None = None
) -> dict:
    
    if conversation_id is None:
        conversation = Conversation(user_id=user_id, title="New Conversation")
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
    else:
        conversation = db.query(Conversation).filter(conversation_id == Conversation.id, Conversation.user_id== user_id).first()
        if not conversation:
            return None
        
    user_msg = Message(
        conversation_id = conversation.id,
        role ="user",
        content = user_message
    )
    db.add(user_msg)
    db.commit()

    history = (
        db.query(Message)
        .filter(Message.conversation_id == conversation.id)
        .filter(Message.id != user_msg.id)
        .order_by(Message.created_at.asc())
        .all()
    )

    ai_response_text = get_ai_response(history, user_message)

    ai_msg = Message(
        conversation_id = conversation.id,
        role = "assistant",
        content = ai_response_text
    )
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)

    if len(history) ==0:
        title = generate_conversation_title(user_message)
        conversation.title = title
        db.commit()

        return {
            "conversation_id": conversation.id,
            "conversation_title": conversation.title,
            "user_message": {
                "id": user_msg.id,
                "role": "user",
                "content": user_message
            },
            "ai_response": {
                "id": ai_msg.id,
                "role": "assistant",
                "content": ai_response_text
            }
        }