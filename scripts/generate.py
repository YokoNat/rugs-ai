import typer
import openai
from slugify import slugify
import os
from utils.prompt_loader import load_prompt


def generate_article(topic: str):
    # Load system prompt
    system_prompt = load_prompt('system_prompt')

    # Compose the full prompt
    user_prompt = f"Write an in-depth article about: {topic}"

    # Call OpenAI GPT-4
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )
    article = response.choices[0].message.content.strip()

    # Slugify topic for filename
    topic_slug = slugify(topic)
    output_dir = 'content'
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, f"{topic_slug}.md")

    # Save the article
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(article)
    print(f"Article saved to {output_path}")

