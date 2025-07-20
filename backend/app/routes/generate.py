from fastapi import APIRouter
from pydantic import BaseModel
from backend.app.utils import ai_tools

router = APIRouter()

class GenerateRequest(BaseModel):
    topic: str
    instructions: str = None

@router.post("/generate")
def generate(request: GenerateRequest):
    article = ai_tools.generate_article(request.topic, request.instructions)
    return {"article": article} 