from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.main import api_router
from src.core.db import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield

app = FastAPI(title="Todo App API", lifespan=lifespan)

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "https://momentum-todo-app.vercel.app",
    "https://momentum-todo-app.vercel.app/",
    "https://hackathon2-frontend-mu.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

app.include_router(api_router, prefix="/api")