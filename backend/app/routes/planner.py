from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from backend.app.utils import ai_tools, prompt_store

router = APIRouter(prefix="/planner", tags=["planner"])

class PlanRequest(BaseModel):
    topic: str
    prompt_id: Optional[str] = None
    supplemental: Optional[str] = None

class PlanContinueRequest(BaseModel):
    topic: str
    prompt_id: Optional[str] = None
    messages: List[Dict[str, str]]
    user_message: str
    supplemental: Optional[str] = None

@router.post("/initial")
def initial_plan(req: PlanRequest):
    custom_prompt = None
    if req.prompt_id:
        p = prompt_store.get_prompt(req.prompt_id)
        if not p:
            raise HTTPException(404, "Prompt not found")
        custom_prompt = p['content']
    outline = ai_tools.generate_plan(req.topic, custom_prompt, req.supplemental)
    return {"outline": outline}

@router.post("/continue")
def continue_plan(req: PlanContinueRequest):
    custom_prompt = None
    if req.prompt_id:
        p = prompt_store.get_prompt(req.prompt_id)
        if not p:
            raise HTTPException(404, "Prompt not found")
        custom_prompt = p['content']
    outline = ai_tools.continue_plan(req.topic, custom_prompt, req.messages, req.user_message, req.supplemental)
    return {"outline": outline} 