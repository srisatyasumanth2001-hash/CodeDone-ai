from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.services import file_service
from app.schemas.file import FileResponse, UploadResponse, FileChatRequest
from fastapi.responses import StreamingResponse
from app.services.ai_service import stream_file_chat_response
from app.services.file_service import get_file_by_id, get_document_by_file_id
from app.services.chat_service import (
    get_conversation_by_id,
    # get_message_by_conversation,
    # save_message
)
from app.services.embedding_service import embed_document
from app.models.conversation import Conversation
from app.models.message import Message
import json

router = APIRouter()

@router.post("/upload", response_model=UploadResponse)
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    file_content = await file.read()

    result = file_service.upload_files(
        db = db,
        user_id=current_user.id,
        filename=file.filename or "unnamed_file",
        content_type=file.content_type or "",
        file_content=file_content
    )

    if "error" in result:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,detail=result["error"]
        )
    document = get_document_by_file_id(db, result["file_id"], current_user.id)
    if document:
        chunks_created = embed_document(db, document)
        result["chunks_embedded"] = chunks_created
    return result

@router.get("/", response_model=List[FileResponse])
def list_files(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return file_service.get_files_by_user(db, current_user.id)

@router.get("/{file_id}", response_model=FileResponse)
def get_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    file = file_service.get_file_by_id(db, file_id, current_user.id)
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    return file

@router.delete("/{file_id}")
def delete_file(
    file_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    deleted = file_service.delete_file(db, file_id, current_user.id)
    if not deleted:
        raise HTTPException(status_code=404, detail="File not found")
    return {"message": "File deleted successfully"}

@router.post("/{file_id}/chat")
async def chat_with_file(
    file_id: int,
    data: FileChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    file = get_file_by_id(db, file_id, current_user.id)
    if not file:
        raise HTTPException(status_code=404, detail="File not found")
    document = get_document_by_file_id(db, file_id, current_user.id)
    if not document:
        raise HTTPException(status_code=404, detail="Document content not found")

    if data.conversation_id is None:
        conversation = Conversation(
            user_id=current_user.id,
            title=f"Chat: {file.original_filename}"
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
    else:
        conversation = get_conversation_by_id(db, data.conversation_id, current_user.id)
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")

    user_msg = Message(
        conversation_id=conversation.id,
        role="user",
        content=data.message
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

    conversation_id = conversation.id
    file_content = document.content
    filename = file.original_filename
    user_message = data.message

    def generate():
        full_response = ""

        yield f"data: {json.dumps({'type': 'metadata', 'conversation_id': conversation_id})}\n\n"

        for token in stream_file_chat_response(
            file_content, filename, history, user_message
        ):
            full_response += token
            yield f"data: {json.dumps({'type': 'token', 'data': token})}\n\n"

        # generator exhausted = OpenAI is done
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
            save_db.refresh(ai_msg)

            yield f"data: {json.dumps({'type': 'assistant_message_id', 'data': ai_msg.id})}\n\n"
        finally:
            save_db.close()

        yield "data: [DONE]\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )