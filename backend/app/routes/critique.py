from fastapi import APIRouter
from pydantic import BaseModel
from backend.app.utils import ai_tools
from backend.app.utils import prompt_store
from fastapi import HTTPException

router = APIRouter()

class CritiqueRequest(BaseModel):
    markdown: str
    prompt_id: str | None = None

@router.post("/critique")
def critique(request: CritiqueRequest):
    custom_prompt = None
    if request.prompt_id:
        p = prompt_store.get_prompt(request.prompt_id)
        if not p:
            raise HTTPException(status_code=404, detail="Prompt not found")
        custom_prompt = p["content"]
    critique_result = ai_tools.critique_content(request.markdown, custom_prompt)
    return {"critique": critique_result} 