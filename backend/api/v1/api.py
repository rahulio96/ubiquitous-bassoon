from fastapi import APIRouter
from backend.api.v1.endpoints import message, question, session, user, code

api_router = APIRouter()

api_router.include_router(
    user.router, 
    prefix="/protected", 
    tags=["user"])

api_router.include_router(
    code.router,
    prefix="/protected",
    tags=["code"]
)

api_router.include_router(
    question.router,
    prefix="/question",
    tags=["question"]
)

api_router.include_router(
    message.router,
    prefix="/message",
    tags=["message"]
)

api_router.include_router(
    session.router,
    prefix="/session",
    tags=["session"]
)