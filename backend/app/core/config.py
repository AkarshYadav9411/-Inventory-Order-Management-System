from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Inventory Order Management API"
    environment: str = Field(default="development")
    database_url: str = Field(default="postgresql+psycopg://postgres:postgres@localhost:5433/inventory")
    secret_key: str = Field(default="change-me")
    algorithm: str = Field(default="HS256")
    access_token_expire_minutes: int = Field(default=30)
    cors_origins: list[str] = Field(default=["http://localhost:5173", "http://localhost:8080"])

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()
