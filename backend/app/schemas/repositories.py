from pydantic import BaseModel


class ConnectRepoRequest(BaseModel):
    repo_url: str


class RepositoryResponse(BaseModel):
    id: int
    repo_url: str
    owner: str
    repo_name: str
    status: str
    files_ingested: int

    class Config:
        from_attributes = True

class BulkDeleteRequest(BaseModel):
    repository_ids: list[int]