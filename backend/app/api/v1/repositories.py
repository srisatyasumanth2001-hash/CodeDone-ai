from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.core.database import get_db, SessionLocal
from app.core.security import get_current_user
from app.models.user import User
from app.models.repository import Repository
from app.services.repository_service import create_repository, ingest_repository, delete_repositories_bulk
from app.services import repository_service
from app.schemas.repositories import ConnectRepoRequest, RepositoryResponse, BulkDeleteRequest

router = APIRouter()

def run_ingestion_background(repository_id: int):
    db = SessionLocal()
    try:
        repository = db.query(Repository).filter(Repository.id == repository_id).first()
        if repository:
            ingest_repository(db, repository)
    finally:
        db.close()

@router.post("/connect", response_model=RepositoryResponse)
def connect_repository(
    data: ConnectRepoRequest,
    background_tasks: BackgroundTasks,
    db:Session= Depends(get_db),
    current_user : User = Depends(get_current_user)
):
    repository = create_repository(db,current_user.id , data.repo_url)
    print(type(repository))
    print(repository.id)
    print(repository.repo_url)
    print(repository.owner)
    print(repository.repo_name)
    print(repository.status)
    print(repository.files_ingested)
    background_tasks.add_task(run_ingestion_background, repository.id)
    return repository

@router.get("/", response_model=list[RepositoryResponse])
def list_repositories(
    db:Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Repository).filter(Repository.user_id== current_user.id).all()

@router.get("/{repository_id}", response_model=RepositoryResponse)
def get_repository(
    repository_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    repo = db.query(Repository).filter(
        Repository.id == repository_id,
        Repository.user_id == current_user.id  
    ).first()

    if not repo:
        raise HTTPException(status_code=404, detail="Repository not found")

    return repo

@router.delete("/{repository_id}")
def delete_repository(
    repository_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    deleted = repository_service.delete_repository(db, repository_id, current_user.id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Repository not found")
    return {"message": "Repository deleted successfully"}

@router.post("/bulk-delete")
def bulk_delete_repositories(
    data: BulkDeleteRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not data.repository_ids:
        raise HTTPException(status_code=400, detail="No repository ids provided")

    deleted_count = delete_repositories_bulk(
        db, data.repository_ids, current_user.id
    )
    return {"deleted_count": deleted_count}
