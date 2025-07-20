import json
import os
from typing import List, Dict, Optional
from uuid import uuid4

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../data')
PROJECTS_FILE = os.path.join(DATA_DIR, 'projects.json')

# Ensure data directory and file exist
os.makedirs(DATA_DIR, exist_ok=True)
if not os.path.exists(PROJECTS_FILE):
    with open(PROJECTS_FILE, 'w', encoding='utf-8') as f:
        json.dump([], f)

def _read_projects() -> List[Dict]:
    with open(PROJECTS_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def _write_projects(projects: List[Dict]):
    with open(PROJECTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(projects, f, indent=2)

def list_projects() -> List[Dict]:
    return _read_projects()

def get_project(project_id: str) -> Optional[Dict]:
    return next((p for p in _read_projects() if p['id'] == project_id), None)

def create_project(data: Dict) -> Dict:
    projects = _read_projects()
    project = {
        'id': str(uuid4()),
        'title': data.get('title', ''),
        'description': data.get('description', ''),
        'custom_instructions': data.get('custom_instructions', ''),
        'planning': data.get('planning', '')
    }
    projects.append(project)
    _write_projects(projects)
    return project

def update_project(project_id: str, data: Dict) -> Optional[Dict]:
    projects = _read_projects()
    for p in projects:
        if p['id'] == project_id:
            p.update({
                'title': data.get('title', p['title']),
                'description': data.get('description', p['description']),
                'custom_instructions': data.get('custom_instructions', p['custom_instructions']),
                'planning': data.get('planning', p['planning'])
            })
            _write_projects(projects)
            return p
    return None

def delete_project(project_id: str) -> bool:
    projects = _read_projects()
    new_projects = [p for p in projects if p['id'] != project_id]
    if len(new_projects) == len(projects):
        return False
    _write_projects(new_projects)
    return True 