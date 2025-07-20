import json
import os
from typing import List, Dict, Optional
from uuid import uuid4

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../data')
PROMPTS_FILE = os.path.join(DATA_DIR, 'prompts.json')

os.makedirs(DATA_DIR, exist_ok=True)
if not os.path.exists(PROMPTS_FILE):
    with open(PROMPTS_FILE, 'w', encoding='utf-8') as f:
        json.dump([], f)

def _read_prompts() -> List[Dict]:
    with open(PROMPTS_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def _write_prompts(prompts: List[Dict]):
    with open(PROMPTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(prompts, f, indent=2)

def list_prompts() -> List[Dict]:
    return _read_prompts()

def get_prompt(prompt_id: str) -> Optional[Dict]:
    return next((p for p in _read_prompts() if p['id'] == prompt_id), None)

def create_prompt(data: Dict) -> Dict:
    prompts = _read_prompts()
    prompt = {
        'id': str(uuid4()),
        'title': data.get('title', ''),
        'content': data.get('content', ''),
        'type': data.get('type', 'generation'),
        'tags': data.get('tags', [])
    }
    prompts.append(prompt)
    _write_prompts(prompts)
    return prompt

def update_prompt(prompt_id: str, data: Dict) -> Optional[Dict]:
    prompts = _read_prompts()
    for p in prompts:
        if p['id'] == prompt_id:
            p.update({
                'title': data.get('title', p['title']),
                'content': data.get('content', p['content']),
                'type': data.get('type', p['type']),
                'tags': data.get('tags', p['tags'])
            })
            _write_prompts(prompts)
            return p
    return None

def delete_prompt(prompt_id: str) -> bool:
    prompts = _read_prompts()
    new_prompts = [p for p in prompts if p['id'] != prompt_id]
    if len(new_prompts) == len(prompts):
        return False
    _write_prompts(new_prompts)
    return True 