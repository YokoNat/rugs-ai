from fastapi import APIRouter
from pydantic import BaseModel
from backend.app.utils import ai_tools
from backend.app.utils import prompt_store
from fastapi import HTTPException

router = APIRouter()

class GenerateRequest(BaseModel):
    topic: str
    instructions: str | None = None
    prompt_id: str | None = None

@router.post("/generate")
def generate(request: GenerateRequest):
    custom_prompt = None
    if request.prompt_id:
        p = prompt_store.get_prompt(request.prompt_id)
        if not p:
            raise HTTPException(status_code=404, detail="Prompt not found")
        custom_prompt = p["content"]
    article = ai_tools.generate_article(request.topic, request.instructions, custom_prompt)
    return {"article": article} 