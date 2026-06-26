from dotenv import load_dotenv
import os

load_dotenv()
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
DATABASE_URL=os.getenv("DATABASE_URL")
SECRET_KEY=os.getenv("SECRET_KEY")
OPENAI_API_KEY=os.getenv("OPENAI_API_KEY")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")