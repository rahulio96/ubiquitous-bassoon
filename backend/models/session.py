from pydantic import BaseModel

class UpdateSessionRequest(BaseModel):
    summary: str
    phase: str
    evaluation: str