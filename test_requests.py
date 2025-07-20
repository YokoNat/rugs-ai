import requests

BASE_URL = "http://localhost:8000"

def test_generate():
    payload = {
        "topic": "Persian Rugs",
        "instructions": "Focus on history and craftsmanship."
    }
    response = requests.post(f"{BASE_URL}/generate", json=payload)
    print("/generate response:")
    print(response.status_code)
    print(response.json())

def test_critique():
    sample_markdown = """
# Persian Rugs

Persian rugs are known for their intricate designs and rich history. They are handwoven and highly valued worldwide.
"""
    payload = {"markdown": sample_markdown}
    response = requests.post(f"{BASE_URL}/critique", json=payload)
    print("/critique response:")
    print(response.status_code)
    print(response.json())

if __name__ == "__main__":
    test_generate()
    test_critique() 