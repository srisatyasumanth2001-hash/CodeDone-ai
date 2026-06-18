from sqlalchemy.orm import Session
from pathlib import Path
from app.models.file import File
from app.models.document import Document
from app.core.storage import (
    generate_unique_filename,
    save_file_to_disk,
    delete_file_from_disk,
    is_allowed_file,
    MAX_FILE_SIZE
)
from app.services.extraction_service import extract_text_from_file, count_words

def upload_files(
        db:Session,
        user_id: int,
        filename: str,
        content_type: str,
        file_content: bytes
)-> dict:
    
    if not is_allowed_file(filename):
        return {"error": f"File type not allowed. Allowed types: PDF, code files, text files"}
    if len(file_content) > MAX_FILE_SIZE:
        return {"error": "File too large. Maximum size is 10MB"}
    if len(file_content) == 0:
        return {"error": "File is empty"}
    
    stored_filename = generate_unique_filename(filename)
    file_extension = Path(filename).suffix.lower()
    storage_path = save_file_to_disk(file_content, stored_filename)

    extracted_text =  extract_text_from_file(storage_path, file_extension)
    word_count = count_words(extracted_text)

    file_record = File(
        user_id=user_id,
        original_filename=filename,
        stored_filename=stored_filename,
        file_type=file_extension,
        file_size=len(file_content),
        storage_path=storage_path
    )
    db.add(file_record)
    db.commit()
    db.refresh(file_record)

    document_record = Document(
        file_id=file_record.id,
        user_id=user_id,
        content=extracted_text,
        word_count=word_count
    )
    db.add(document_record)
    db.commit()
    db.refresh(document_record)

    return {
        "file_id" : file_record.id,
        "filename": filename,
        "file_type": file_extension,
        "file_size": len(file_content),
        "word_count": word_count,
        "message" : "File uploaded successfully"
    }

def get_files_by_user(db: Session, user_id: int):
    return(
        db.query(File)
        .filter(File.user_id == user_id)
        .order_by(File.created_at.desc())
        .all()
    )

def get_file_by_id(db: Session, file_id: int, user_id: int):
    return(
        db.query(File)
        .filter(File.id == file_id, File.user_id == user_id)
        .first()
    )

def get_document_by_file_id(db: Session, file_id: int, user_id: int):
    
    return (
        db.query(Document)
        .filter(Document.file_id == file_id, Document.user_id == user_id)
        .first()
    )

def delete_file(db: Session, file_id:int, user_id:int) ->bool:
    file_record = get_file_by_id(db, file_id, user_id)
    if not file_record:
        return False
    delete_file_from_disk(file_record.stored_filename)
    db.delete(file_record)
    db.commit()
    return True