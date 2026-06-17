import os
import uuid
from pathlib import Path

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

MAX_FILE_SIZE = 10*1024*1024

ALLOWED_TYPES = {
    "application/pdf": ".pdf",
    "text/plain": ".txt",
    "text/x-python": ".py",
    "application/javascript": ".js",
    "text/typescript": ".ts",
    "text/jsx": ".jsx",
    "text/html": ".html",
    "text/css": ".css",
    "application/json": ".json",
    "text/markdown": ".md",
}

ALLOWED_EXTENSIONS = {
    '.pdf', '.txt', '.py', '.js', '.ts', '.tsx', '.jsx',
    '.html', '.css', '.json', '.md', '.java', '.cpp',
    '.c', '.go', '.rs', '.rb', '.php', '.yaml', '.yml'
}

def generate_unique_filename(original_filename: str) -> str:
    ext = Path(original_filename).suffix.lower()
    unique_id = str(uuid.uuid4())[:8]
    safe_name = original_filename.replace(' ', '_')
    return f"{unique_id}-{safe_name}"

def get_file_path(stored_filename: str)-> Path:
    return UPLOAD_DIR/ stored_filename

def save_file_to_disk(file_content: bytes, stored_filename: str)-> str:
    print("save function called")
    file_path = get_file_path(stored_filename)
    with open(file_path, 'wb') as f:
        f.write(file_content)
    print("file saved", file_path)
    return str(file_path)

def delete_file_from_disk(stored_filename: str)-> bool:
    file_path = get_file_path(stored_filename)
    if file_path.exists():
        os.remove(file_path)

def is_allowed_file(filename: str) -> bool:
    ext = Path(filename).suffix.lower()
    return ext in ALLOWED_EXTENSIONS