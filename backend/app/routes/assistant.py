from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.app.utils import ai_tools

router = APIRouter(prefix="/assistant", tags=["assistant"])

class RefineRequest(BaseModel):
    mode: str  # "prompt" or "supplement"
    text: str  # current content
    instruction: str | None = None  # user's instruction
    system_prompt: str | None = None

@router.post("/refine")
def refine(req: RefineRequest):
    if req.mode not in {"prompt", "supplement"}:
        raise HTTPException(400, "mode must be 'prompt' or 'supplement'")
    refined = ai_tools.refine_text(req.text, req.mode, req.instruction, req.system_prompt)
    return {"refined": refined} 