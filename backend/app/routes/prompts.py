from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from backend.app.utils import prompt_store

router = APIRouter(prefix="/prompts", tags=["prompts"])

class Prompt(BaseModel):
    id: str
    title: str
    content: str
    type: str  # 'generation' or 'critique'
    tags: List[str] = []

class PromptCreate(BaseModel):
    title: str
    content: str
    type: str = "generation"
    tags: List[str] = []

class PromptUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    type: Optional[str] = None
    tags: Optional[List[str]] = None

@router.get("/", response_model=List[Prompt])
def list_prompts():
    return prompt_store.list_prompts()

@router.post("/", response_model=Prompt)
def create_prompt(prompt: PromptCreate):
    return prompt_store.create_prompt(prompt.dict())

@router.get("/{prompt_id}", response_model=Prompt)
def get_prompt(prompt_id: str):
    p = prompt_store.get_prompt(prompt_id)
    if not p:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return p

@router.put("/{prompt_id}", response_model=Prompt)
def update_prompt(prompt_id: str, update: PromptUpdate):
    p = prompt_store.update_prompt(prompt_id, update.dict(exclude_unset=True))
    if not p:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return p

@router.delete("/{prompt_id}")
def delete_prompt(prompt_id: str):
    success = prompt_store.delete_prompt(prompt_id)
    if not success:
        raise HTTPException(status_code=404, detail="Prompt not found")
    return {"status": "deleted"} 