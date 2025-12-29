from sqlmodel import SQLModel, create_engine, text
from src.core.config import settings
# Import all models so SQLModel knows about them
from src.models.auth import User, Session, Account, Verification, JWKS
from src.models.task import Task

def reset_database():
    print("Connecting to database...")
    engine = create_engine(settings.DATABASE_URL)
    
    print("Dropping all tables (Hard Reset)...")
    with engine.connect() as conn:
        # Cascade drop to handle foreign keys
        conn.execute(text("DROP TABLE IF EXISTS tasks CASCADE;"))
        conn.execute(text("DROP TABLE IF EXISTS session CASCADE;"))
        conn.execute(text("DROP TABLE IF EXISTS account CASCADE;"))
        conn.execute(text("DROP TABLE IF EXISTS verification CASCADE;"))
        conn.execute(text("DROP TABLE IF EXISTS jwks CASCADE;")) # Added jwks
        conn.execute(text("DROP TABLE IF EXISTS \"user\" CASCADE;"))
        conn.commit()
        
    print("Recreating tables...")
    SQLModel.metadata.create_all(engine)
    print("Database schema synced with Better Auth.")

if __name__ == "__main__":
    reset_database()