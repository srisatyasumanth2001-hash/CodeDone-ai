from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import auth
from app.models.user import User
# from app.core.database import engine, Base


app = FastAPI(title="CodeDone-AI", version="1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_credentials=True,
    allow_headers=["*"],)
app.include_router(auth.router,prefix="/api/v1/auth",tags=["Authentication"])
# Base.metadata.create_all(bind=engine)
@app.get("/")
def root():    
    return {"message": "CodeDone-AI is running!"}