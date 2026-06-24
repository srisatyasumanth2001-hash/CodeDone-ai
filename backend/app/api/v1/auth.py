from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services import user_service
from app.core.security import get_current_user
from app.models.user import User
from app.schemas.auth import SignupRequest, LoginRequest, TokenResponse, UserResponse, RefreshRequest, UpdateProfileRequest
from app.core.security import verify_password, create_access_token, create_refresh_token, verify_token

router = APIRouter()

@router.post("/signup")
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    # check if email already exists
    existing_user = user_service.get_user_by_email(db, data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # call the service to create the user
    user = user_service.create_user(db, data.email, data.password, data.full_name)
    return user
@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = user_service.get_user_by_email(db, data.email)
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)
@router.get("/me", response_model=UserResponse)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/refresh")
def refresh(data: RefreshRequest):

    payload = verify_token(data.refresh_token)

    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token"
        )

    user_id = int(payload["sub"])

    access_token = create_access_token(user_id)

    return {
        "access_token": access_token
    }

@router.patch("/me", response_model=UserResponse)
def update_profile(
    data: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    updated_user = user_service.update_user_name(db, current_user.id, data.full_name)
    return updated_user