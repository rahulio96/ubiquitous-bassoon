from fastapi import APIRouter, Depends
from backend.api.verify_token import verify_token
from backend.models.user import User

router = APIRouter()

# Get current user's info
@router.get("/user")
async def get_user(user: User = Depends(verify_token)):
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "first_name": user.first_name
    }

# Placeholder
@router.get("/hello")
async def hello(user: User = Depends(verify_token)):
    return {"message": f"Hello, {user.first_name}!"}