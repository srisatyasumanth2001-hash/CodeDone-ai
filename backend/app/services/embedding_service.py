from openai import OpenAI
from app.core.config import OPENAI_API_KEY
from sqlalchemy.orm import Session
from app.models.embedding import Embedding
from app.models.document import Document
from app.models.file import File
from app.services.chunking_service import chunk_document
from pgvector.sqlalchemy import Vector
import numpy as np

client = OpenAI(api_key =OPENAI_API_KEY)
EMBEDDING_MODEL = "text-embedding-3-small"
EMBEDDING_DIMENSIONS = 1536

def embed_text(text: str) -> list[float]:
    response = client.embeddings.create(
        model = EMBEDDING_MODEL,
        input = text,
    )
    return response.data[0].embedding

def embed_document(db:Session, document: Document) -> int:
    db.query(Embedding).filter(
        Embedding.document_id == document.id
    ).delete()
    db.commit()

    chunks = chunk_document(document.content)
    if not chunks:
        return 0
    embeddings_created =0

    for chunk in chunks:
        vector = embed_text(chunk["text"])
        embedding_record = Embedding(
            document_id = document.id,
            user_id = document.user_id,
            chunk_text = chunk["text"],
            chunk_index = chunk["index"],
            embedding = vector
        )
        db.add(embedding_record)
        embeddings_created += 1
    db.commit()
    return embeddings_created



def search_similar_chunks(
        db: Session,
        user_id: int,
        query: str,
        limit: int = 5,
        document_id: int = None
) -> list[dict]:
    query_vector = embed_text(query)

    base_query = (
        db.query(
            Embedding.chunk_text,
            Embedding.chunk_index,
            Embedding.document_id,
            Document.source_type,
            Document.file_path,
            File.original_filename,
            (1 - Embedding.embedding.cosine_distance(query_vector)).label("similarity")
        )
        .join(Document, Embedding.document_id == Document.id)
        .outerjoin(File, Document.file_id == File.id)   # LEFT JOIN — repo docs have no file_id at all
        .filter(Embedding.user_id == user_id)
    )

    if document_id:
        base_query = base_query.filter(Embedding.document_id == document_id)

    results = (
        base_query
        .order_by(Embedding.embedding.cosine_distance(query_vector))
        .limit(limit)
        .all()
    )

    chunks = []
    for r in results:
        if r.source_type == "repository":
            display_name = r.file_path or f"Document #{r.document_id}"
        else:
            display_name = r.original_filename or f"Document #{r.document_id}"

        chunks.append({
            "chunk_text": r.chunk_text,
            "chunk_index": r.chunk_index,
            "document_id": r.document_id,
            "filename": display_name,
            "source_type": r.source_type or "upload",
            "similarity": float(r.similarity)
        })

    return chunks