from fastapi import APIRouter
from pydantic import BaseModel
from backend.app.utils import ai_tools

router = APIRouter()

class CritiqueRequest(BaseModel):
    markdown: str

@router.post("/critique")
def critique(request: CritiqueRequest):
    critique_result = ai_tools.critique_content(request.markdown)
    return {"critique": critique_result} 