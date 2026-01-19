from fastapi import APIRouter
from backend.api.v1.endpoints import user

api_router = APIRouter()
api_router.include_router(user.router, prefix="/protected", tags=["protected"])