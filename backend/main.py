from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.core.config import CROSS_ORIGINS
from backend.api.v1.api import api_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=CROSS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")