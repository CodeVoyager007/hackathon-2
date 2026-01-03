from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET: str # Keeping for legacy/compatibility
    BETTER_AUTH_SECRET: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    GEMINI_API_KEY: str
    GEMINI_BASE_URL: str = "https://generativelanguage.googleapis.com/v1beta/openai/"
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "https://momentum-todo-app.vercel.app",
        "https://momentum-todo-app.vercel.app/",
        "https://hackathon2-frontend-mu.vercel.app",
    ]

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()