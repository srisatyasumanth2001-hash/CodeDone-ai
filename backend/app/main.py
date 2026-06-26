from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import auth, chat, files, search, repositories, dashboard, saved_response, global_search
from app.models.user import User
from app.core.config import CORS_ORIGINS
from sqlalchemy import text
from app.core.database import SessionLocal
# from app.core.database import engine, Base


app = FastAPI(title="CodeDone-AI", version="1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_methods=["*"],
    allow_credentials=True,
    allow_headers=["*"],)
app.include_router(auth.router,prefix="/api/v1/auth",tags=["Authentication"])
app.include_router(chat.router,prefix="/api/v1/chat",tags=["Chat"] )
app.include_router(files.router,prefix="/api/v1/files",tags=["Files"])
app.include_router(search.router, prefix="/api/v1/search", tags=["Search"])
app.include_router(repositories.router, prefix="/api/v1/repositories", tags=["Repositories"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["Dashboard"])
app.include_router(saved_response.router, prefix="/api/v1/saved", tags=["Saved Response"])
app.include_router(global_search.router, prefix="/api/v1/global-search", tags=["Saved Response"])

# Base.metadata.create_all(bind=engine)
@app.get("/")
def root():    
    return {"message": "CodeDone-AI is running!"}



@app.get("/health")
def health_check():
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": str(e)}