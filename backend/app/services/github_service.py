import httpx
from app.core.config import GITHUB_TOKEN

GITHUB_API = "https://api.github.com"
IGNORE_DIRS = {
    "node_modules", ".git", "dist", "build", "__pycache__",
    "venv", ".venv", "vendor", ".next", "coverage"
}
ALLOWED_EXTENSIONS = {
    ".py", ".js", ".ts", ".tsx", ".jsx", ".java", ".go", ".rs",
    ".md", ".json", ".yml", ".yaml", ".sql", ".html", ".css"
}
MAX_FILES_SIZE_BYTES = 100_000

def parse_repo_url(repo_url:str) -> tuple[str, str]:
    cleaned = repo_url.rstrip("/").replace(".git", "")
    parts = cleaned.split("/")
    return parts[-2], parts[-1]

def fetch_repo_tree(owner: str, repo: str, branch: str="main")-> list[dict]:
    url = f"{GITHUB_API}/repos/{owner}/{repo}/git/trees/{branch}"
    headers = {"Authorization": f"token {GITHUB_TOKEN}"}

    response = httpx.get(url, headers=headers, params={"recursive": "1"})
    response.raise_for_status()
    tree = response.json().get("tree", [])
    return [item for item in tree if item["type"]=="blob"]

def is_file_eligible(file_path:str)-> bool:
    path_parts = file_path.split("/")
    if any(part in IGNORE_DIRS for part in path_parts):
        return False
    if not any(file_path.endswith(ext) for ext in ALLOWED_EXTENSIONS):
        return False

    return True
def fetch_file_content(owner: str, repo: str, branch: str, path:str)->str| None:
     url = f"https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}"
     response = httpx.get(url)
     if response.status_code != 200:
         return None
     if len(response.content) > MAX_FILES_SIZE_BYTES:
         return None
     return response.text