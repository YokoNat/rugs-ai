import json, os
from typing import Dict

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../data')
SETTINGS_FILE = os.path.join(DATA_DIR, 'settings.json')

DEFAULT_SETTINGS = {
    "prompt_system": "You are an expert AI prompt engineer. You help users craft clear, specific, high quality prompts for large language models. Always return ONLY the improved prompt with no extra commentary.",
    "supplement_system": "You are a skilled technical writer. You refine user-provided supplemental information (reference text) by fixing grammar, simplifying where possible, and making the content concise while preserving meaning. Always return ONLY the improved text with no extra commentary."
}

os.makedirs(DATA_DIR, exist_ok=True)
if not os.path.exists(SETTINGS_FILE):
    with open(SETTINGS_FILE, 'w', encoding='utf-8') as f:
        json.dump(DEFAULT_SETTINGS, f, indent=2)

def _read() -> Dict:
    with open(SETTINGS_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def _write(data: Dict):
    with open(SETTINGS_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

def get_settings() -> Dict:
    return _read()

def update_settings(data: Dict) -> Dict:
    settings = _read()
    settings.update(data)
    _write(settings)
    return settings 