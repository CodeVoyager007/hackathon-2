from sqlmodel import SQLModel, create_engine, text
from src.core.config import settings
import src.models # Ensure all models are imported

def sync_database():
    print("Connecting to database for schema sync...")
    engine = create_engine(settings.DATABASE_URL)
    
    with engine.connect() as conn:
        print("Dropping all known tables...")
        # Use CASCADE to handle dependencies
        conn.execute(text("DROP TABLE IF EXISTS messages CASCADE;"))
        conn.execute(text("DROP TABLE IF EXISTS conversations CASCADE;"))
        conn.execute(text("DROP TABLE IF EXISTS tasks CASCADE;"))
        conn.execute(text("DROP TABLE IF EXISTS session CASCADE;"))
        conn.execute(text("DROP TABLE IF EXISTS account CASCADE;"))
        conn.execute(text("DROP TABLE IF EXISTS verification CASCADE;"))
        conn.execute(text("DROP TABLE IF EXISTS jwks CASCADE;"))
        conn.execute(text("DROP TABLE IF EXISTS \"user\" CASCADE;"))
        conn.commit()
        
    print("Recreating all tables from models...")
    SQLModel.metadata.create_all(engine)
    print("Database schema successfully synced.")

if __name__ == "__main__":
    sync_database()

