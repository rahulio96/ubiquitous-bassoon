from pydantic import BaseModel

class User(BaseModel):
    id: str
    full_name: str = None
    first_name: str = None
    email: str
