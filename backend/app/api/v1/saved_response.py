from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.services import saved_response_service
from app.schemas.saved_response import SaveResponseRequest, SavedResponseResponse

router = APIRouter()


@router.post("/", response_model=SavedResponseResponse)
def save_response(
    data: SaveResponseRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return saved_response_service.save_response(db, current_user.id, data.dict())


@router.get("/", response_model=list[SavedResponseResponse])
def list_saved_responses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return saved_response_service.get_saved_responses(db, current_user.id)


@router.delete("/{saved_id}")
def delete_saved_response(
    saved_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    deleted = saved_response_service.delete_saved_response(db, saved_id, current_user.id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Saved response not found")
    return {"message": "Deleted successfully"}