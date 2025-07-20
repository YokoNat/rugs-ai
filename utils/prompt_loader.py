def load_prompt(name: str) -> str:
    path = f'prompts/{name}.txt'
    with open(path, 'r', encoding='utf-8') as f:
        return f.read() 