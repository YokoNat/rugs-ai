# ai_tools.py
# This module will wrap generation and critique logic for FastAPI routes.

from utils.prompt_loader import load_prompt
import openai


def generate_article(topic: str, instructions: str = None) -> str:
    system_prompt = load_prompt('system_prompt')
    user_prompt = f"Write an in-depth article about: {topic}"
    if instructions:
        user_prompt += f"\nInstructions: {instructions}"
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )
    article = response.choices[0].message.content.strip()
    return article


def critique_content(markdown: str) -> str:
    system_prompt = load_prompt('critique')
    user_prompt = f"Please critique the following markdown content for SEO, clarity, and quality.\n\n{markdown}"
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )
    critique = response.choices[0].message.content.strip()
    return critique 