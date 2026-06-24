from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.services.global_search_service import search_everything
from app.schemas.global_search import GlobalSearchResponse

router = APIRouter()


@router.get("/", response_model=GlobalSearchResponse)
def global_search(
    q: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not q.strip():
        return {"conversations": [], "files": [], "repositories": []}
    return search_everything(db, current_user.id, q.strip())