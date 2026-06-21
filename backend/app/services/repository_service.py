from sqlalchemy.orm import Session
from app.models.repository import Repository
from app.models.document import Document
from app.services.github_service import (
    fetch_repo_tree, fetch_file_content, is_file_eligible, parse_repo_url
)
from app.services.embedding_service import embed_document

def create_repository(db: Session, user_id:int, repo_url: str)-> Repository:
    owner, repo_name = parse_repo_url(repo_url)
    repo = Repository(
        user_id=user_id,
        repo_url=repo_url,
        owner=owner,
        repo_name=repo_name,
        status="pending"
    )
    db.add(repo)
    db.commit()
    db.refresh(repo)
    return repo

def ingest_repository(db:Session, repository: Repository)-> None:
    repository.status ="ingesting"
    db.commit()
    try:
        tree= fetch_repo_tree(repository.owner, repository.repo_name, repository.default_branch)
        eligible_files= [item for item in tree if is_file_eligible(item["path"])]
        files_ingested=0
        for item in eligible_files:
            file_path = item["path"]
            content= fetch_file_content(
                repository.owner, repository.repo_name, repository.default_branch, file_path
            )
            if not content or not content.strip():
                continue
            document = Document(
                user_id=repository.user_id,
                repository_id=repository.id,
                file_path=file_path,
                source_type="repository",
                content=content,
                word_count=len(content.split())
            )
            db.add(document)
            db.commit()
            db.refresh(document)

            embed_document(db, document)
            files_ingested +=  1
        repository.status ="completed"
        repository.files_ingested= files_ingested
        db.commit()
    except Exception as e:
        repository.status ="failed"
        repository.error_message= str(e)[:500]
        db.commit()