from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.message import Message
from app.models.saved_response import SavedResponse
from app.models.conversation import Conversation
from app.services import chat_service
from app.services import chat_service, ai_service
from app.schemas.chat import (
    ConversationDetailResponse,
    ConversationResponse,
    SendMessageRequest
)
from typing import List
from typing import Generator
import json

router = APIRouter()

@router.post("/conversations", response_model=ConversationResponse)
def create_new_conversation(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    conversation = chat_service.create_conversation(db, current_user.id)
    return conversation

@router.get("/conversations", response_model=List[ConversationResponse])
def list_conversation(
    db:Session = Depends(get_db),
    current_user : User = Depends(get_current_user)
):
    return chat_service.get_conversation_by_user(db, current_user.id)

@router.get("/conversations/{conversation_id}", response_model=ConversationDetailResponse)
def get_conversation(
    conversation_id :int,
    db:Session = Depends(get_db),
    current_user : User = Depends(get_current_user)
):
    conversation = chat_service.get_conversation_by_id(db, conversation_id,current_user.id )
    if not conversation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="conversation not found")
    return conversation

@router.delete("/conversations/{conversation_id}")
def delete_conversation(
    conversation_id :int,
    db:Session = Depends(get_db),
    current_user : User = Depends(get_current_user)
):
    conversation = chat_service.get_conversation_by_id(db, conversation_id,current_user.id )
    if not conversation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="conversation not found")
    chat_service.delete_conversation(db, conversation_id)
    return {"message": "conversation deleted"}

@router.post("/send")
def send_message(
    data: SendMessageRequest,
    db:Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not data.message.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Message can't be empty")
    result = chat_service.send_message_and_get_response(
        db = db,
        user_id= current_user.id,
        user_message=data.message,
        conversation_id=data.conversation_id
    )
    if result is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="conversation not found")
    
    return result

@router.post("/stream")
def stream_chat(
    data: SendMessageRequest,
    db:Session = Depends(get_db),
    current_user : User = Depends(get_current_user)
):
    if not data.message.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail = "Message can't be empty")
    if data.conversation_id is None:
        conversation = Conversation(user_id = current_user.id, title= "New conversation")
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
    else:
        conversation = (db.query(Conversation).filter(Conversation.id == data.conversation_id, Conversation.user_id== current_user.id).first())
        if not conversation:
            raise HTTPException(status_code=404, detail= "Conversation not found")
        
    user_msg = Message(
        conversation_id = conversation.id,
        role ="user",
        content = data.message
    )
    db.add(user_msg)
    db.commit()

    history =(
        db.query(Message)
        .filter(Message.conversation_id == conversation.id)
        .filter(Message.id != user_msg.id)
        .order_by(Message.created_at.asc())
        .all()
    )

    is_first_message = len(history) == 0

    conversation_id = conversation.id
    user_message = data.message 

    def generate() -> Generator:
        full_response = ""
        metadata = {
            "conversation_id": conversation_id,
            "is_first_message": is_first_message,
            "user_message_id": user_msg.id   # ← real id, already known at this point
        }
        yield f"data: {json.dumps({'type': 'metadata', 'data': metadata})}\n\n"

        for token in ai_service.stream_ai_response(history, user_message):
            full_response += token
            yield f"data: {json.dumps({'type': 'token', 'data': token})}\n\n"

        from app.core.database import SessionLocal
        save_db = SessionLocal()
        try:
            ai_msg = Message(
                conversation_id=conversation_id,
                role="assistant",
                content=full_response
            )
            save_db.add(ai_msg)
            save_db.commit()
            save_db.refresh(ai_msg)   # ← populates ai_msg.id with the real database id

            # tell the frontend the real id, before [DONE]
            yield f"data: {json.dumps({'type': 'assistant_message_id', 'data': ai_msg.id})}\n\n"

            if is_first_message:
                title = chat_service.generate_conversation_title(user_msg.content)
                conv = save_db.query(Conversation).filter(
                    Conversation.id == conversation_id
                ).first()
                if conv:
                    conv.title = title
                    save_db.commit()
                yield f"data: {json.dumps({'type': 'title', 'data': title})}\n\n"
        finally:
            save_db.close()

        yield "data: [DONE]\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"  # prevents nginx from buffering the stream
        }
    )

                        