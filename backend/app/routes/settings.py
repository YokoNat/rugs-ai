from fastapi import APIRouter
from pydantic import BaseModel
from backend.app.utils import settings_store

router = APIRouter(prefix="/settings", tags=["settings"])

class SettingsUpdate(BaseModel):
    prompt_system: str | None = None
    supplement_system: str | None = None

@router.get("/")
def get_settings():
    return settings_store.get_settings()

@router.put("/")
def update_settings(payload: SettingsUpdate):
    data = payload.model_dump(exclude_none=True)
    return settings_store.update_settings(data) 