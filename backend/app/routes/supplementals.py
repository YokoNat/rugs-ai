from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from backend.app.utils import supp_store

router = APIRouter(prefix="/supplementals", tags=["supplementals"])

class SuppIn(BaseModel):
    title: str
    content: str
    tags: List[str] = []

class SuppOut(SuppIn):
    id: str

@router.get("/", response_model=List[SuppOut])
def list_supplementals():
    return supp_store.list_items()

@router.post("/", response_model=SuppOut)
def create_supplemental(data: SuppIn):
    return supp_store.create_item(data.model_dump())

@router.put("/{item_id}", response_model=SuppOut)
def update_supplemental(item_id: str, data: SuppIn):
    upd = supp_store.update_item(item_id, data.model_dump())
    if not upd:
        raise HTTPException(404, "Not found")
    return upd

@router.delete("/{item_id}")
def delete_supplemental(item_id: str):
    if not supp_store.delete_item(item_id):
        raise HTTPException(404, "Not found")
    return {"ok": True} 