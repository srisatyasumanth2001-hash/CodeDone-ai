from sqlalchemy.orm import Session
from app.services.embedding_service import search_similar_chunks
from app.services.ai_service import stream_rag_response
from app.core.prompt import build_rag_prompt

def search_and_answer(
        db: Session,
        user_id: int, 
        query: str,
        document_id : int = None,
        top_k :int= 5
)-> dict:
    chunks = search_similar_chunks(
        db =db, 
        user_id=user_id,    
        query=  query,
        limit=top_k,
        document_id=document_id
    )
    if not chunks:
        return{
            "answer" : "No relevant documents found",
            "sources" : [],
            "query" : query
        }
    relevant_chunks = [c for c in chunks if c["similarity"] >= 0.25]
    if not relevant_chunks:
        return{
            "answer" : "I couldn't find relevant information in your documents",
            "sources" : [],
            "query" : query
        }
    rag_prompt = build_rag_prompt(query,relevant_chunks)
    return {
        "rag_prompt" : rag_prompt,
        "sources" :  relevant_chunks,
        "query" : query
    }

def get_search_context(
        db: Session,
        user_id: int,
        query: str,
        document_id:int = None,
        top_k: int = 5
)-> tuple[str, list[dict]]:
    chunks = search_similar_chunks(
        db =db, 
        user_id=user_id,    
        query=  query,
        limit=top_k,
        document_id=document_id
    )
    relevant_chunks =[c for c in chunks if c["similarity"] >=0.25]
    if not relevant_chunks:
        return None, []
    rag_prompt = build_rag_prompt(query, relevant_chunks)
    return rag_prompt, relevant_chunks