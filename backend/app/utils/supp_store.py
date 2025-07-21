import json
import os
from typing import List, Dict, Optional
from uuid import uuid4
from datetime import datetime

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../data')
SUPP_FILE = os.path.join(DATA_DIR, 'supplementals.json')

os.makedirs(DATA_DIR, exist_ok=True)
if not os.path.exists(SUPP_FILE):
    with open(SUPP_FILE, 'w', encoding='utf-8') as f:
        json.dump([], f)

def _read() -> List[Dict]:
    with open(SUPP_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def _write(data: List[Dict]):
    with open(SUPP_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

def list_items() -> List[Dict]:
    return _read()

def get_item(item_id: str) -> Optional[Dict]:
    return next((i for i in _read() if i['id'] == item_id), None)

def create_item(data: Dict) -> Dict:
    items = _read()
    item = {
        'id': str(uuid4()),
        'title': data.get('title', ''),
        'content': data.get('content', ''),
        'tags': data.get('tags', []),
        'created_at': datetime.utcnow().isoformat()
    }
    items.append(item)
    _write(items)
    return item

def update_item(item_id: str, data: Dict) -> Optional[Dict]:
    items = _read()
    for itm in items:
        if itm['id'] == item_id:
            itm.update({
                'title': data.get('title', itm['title']),
                'content': data.get('content', itm['content']),
                'tags': data.get('tags', itm['tags'])
            })
            _write(items)
            return itm
    return None

def delete_item(item_id: str) -> bool:
    items = _read()
    new_items = [i for i in items if i['id'] != item_id]
    if len(new_items) == len(items):
        return False
    _write(new_items)
    return True 