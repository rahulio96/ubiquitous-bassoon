from fastapi import APIRouter
from backend.api.v1.endpoints import question, user, code

api_router = APIRouter()

api_router.include_router(
    user.router, 
    prefix="/protected", 
    tags=["protected"])

api_router.include_router(
    code.router,
    prefix="/protected",
    tags=["protected"]
)

api_router.include_router(
    question.router,
    prefix="/question",
)