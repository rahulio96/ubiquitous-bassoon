from pydantic import BaseModel

class CodeExecutionResponse(BaseModel):
    output: str
    is_error: bool