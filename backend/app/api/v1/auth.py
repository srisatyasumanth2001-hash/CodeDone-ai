from fastapi import APIRouter
router = APIRouter()

@router.post("/signup")
def signup():
    return {"message": "Signup endpoint"}
@router.post("/login")
def login():
    return {"message": "Login endpoint"}