import typer
import openai
from rich import print
from utils.prompt_loader import load_prompt


def critique_content(file_path: str):
    # Load system prompt
    system_prompt = load_prompt('critique')

    # Read the markdown file
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Compose the prompt for critique
    user_prompt = f"Please critique the following markdown content for SEO, clarity, and quality.\n\n{content}"

    # Call OpenAI GPT-4
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )
    critique = response.choices[0].message.content.strip()

    # Print the critique result
    print(f"[bold green]Critique Result:[/bold green]\n{critique}")
    # Will add quality checks + suggestions here
