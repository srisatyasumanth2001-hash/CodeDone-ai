from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
import json
from app.core.database import get_db, SessionLocal
from app.core.security import get_current_user
from app.models.user import User 
from app.services.search_service import get_search_context
from app.services.ai_service import stream_rag_response
from app.services.embedding_service import search_similar_chunks
from app.schemas.search import SearchRequest, ChunkResult

router = APIRouter()

@router.post("/stream")
def stream_search(
    data: SearchRequest,
    db: Session= Depends(get_db),
    current_user: User= Depends(get_current_user)
):
    if not data.query.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail= "Query can't be empty"
        )
    rag_prompt, source_chunks = get_search_context(
        db=db,
        user_id=current_user.id,
        query= data.query,
        document_id=data.document_id,
        top_k=data.top_k
    )

    if not rag_prompt:
        def no_results():
            msg = "I could not find relevant information in your documents for this query. Try uploading more documents or rephrasing your question."
            yield f"data: {json.dumps({'type': 'token', 'data': msg})}\n\n"
            yield f"data: {json.dumps({'type': 'sources', 'data': []})}\n\n"
            yield "data: [DONE]\n\n"
        return StreamingResponse(
            no_results(),
            media_type="text/event-stream",
            headers={"Cache-Control": "no-cache", "X-Accel-Buffering" :"no"}
        )
    def generate():
        yield f"data: {json.dumps({'type': 'sources', 'data': source_chunks})}\n\n"
        full_response = ""
        for token in stream_rag_response(rag_prompt, data.query):
            full_response += token
            yield f"data: {json.dumps({'type': 'token', 'data': token})}\n\n"

        yield "data: [DONE]\n\n"
    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive", "X-Accel-Buffering" :"no"}
    )

@router.post("/chunks")
def get_chunks_only(
    data: SearchRequest,
    db: Session= Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not data.query.strip():  
        raise HTTPException(status_code=400, detail="Query can't be empty")
    chunks = search_similar_chunks(
        db = db,
        user_id=current_user.id,
        query= data.query,
        limit=data.top_k,
        document_id=data.document_id
    )
    return {
        "query": data.query,
        "chunks_found": len(chunks),
        "chunks" : chunks
    }