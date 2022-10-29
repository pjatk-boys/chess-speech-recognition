from pydantic import BaseSettings


class Settings(BaseSettings):
    LOG_LEVEL = 20


settings = Settings()
