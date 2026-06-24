from pydantic import BaseModel, EmailStr
class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None
class LoginRequest(BaseModel):
    email: EmailStr
    password: str
class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str | None = None
    
    class Config:
        from_attributes = True

class RefreshRequest(BaseModel):
    refresh_token: str

class UpdateProfileRequest(BaseModel):
    full_name: str