from sqlmodel import SQLModel, create_engine, Session
from src.core.config import settings

# neon requires sslmode=require
# pool_pre_ping=True checks connection liveness before using it, preventing "SSL connection closed" errors
engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)

def get_session():
    with Session(engine) as session:
        yield session

def init_db():
    SQLModel.metadata.create_all(engine)