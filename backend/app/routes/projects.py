from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from backend.app.utils import project_store

router = APIRouter(prefix="/projects", tags=["projects"])

class Project(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    custom_instructions: Optional[str] = None
    planning: Optional[str] = None

class ProjectCreate(BaseModel):
    title: str
    description: Optional[str] = None
    custom_instructions: Optional[str] = None
    planning: Optional[str] = None

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    custom_instructions: Optional[str] = None
    planning: Optional[str] = None

@router.get("/", response_model=List[Project])
def list_projects():
    return project_store.list_projects()

@router.post("/", response_model=Project)
def create_project(project: ProjectCreate):
    return project_store.create_project(project.dict())

@router.get("/{project_id}", response_model=Project)
def get_project(project_id: str):
    proj = project_store.get_project(project_id)
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    return proj

@router.put("/{project_id}", response_model=Project)
def update_project(project_id: str, update: ProjectUpdate):
    proj = project_store.update_project(project_id, update.dict(exclude_unset=True))
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    return proj

@router.delete("/{project_id}")
def delete_project(project_id: str):
    success = project_store.delete_project(project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"status": "deleted"} 