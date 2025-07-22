# ai_tools.py
# This module will wrap generation and critique logic for FastAPI routes.

from utils.prompt_loader import load_prompt
import openai


def generate_article(topic: str, instructions: str | None = None, custom_prompt: str | None = None, supplemental: str | None = None) -> str:
    system_prompt = custom_prompt or load_prompt('system_prompt')
    user_prompt = f"Write an in-depth article about: {topic}"
    if supplemental:
        user_prompt = f"Supplemental information:\n{supplemental}\n\n" + user_prompt
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


def critique_content(markdown: str, custom_prompt: str | None = None, supplemental: str | None = None) -> str:
    system_prompt = custom_prompt or load_prompt('critique')
    user_prompt = ""
    if supplemental:
        user_prompt += f"Supplemental information:\n{supplemental}\n\n"
    user_prompt += f"Please critique the following markdown content for SEO, clarity, and quality.\n\n{markdown}"
    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )
    critique = response.choices[0].message.content.strip()
    return critique


# ----------------------------- PLANNER ---------------------------------


def _default_planner_system_prompt() -> str:
    """Fallback system prompt for the planner if no custom prompt is supplied."""
    return (
        "You are an expert content strategist. Generate a clear hierarchical outline "
        "for a high-quality article or piece of long-form content. Start with the main "
        "H1 title, followed by major sections (H2 / H3) and brief bullet points under "
        "each. Be concise yet thorough."
    )


def generate_plan(topic: str, custom_prompt: str | None = None, supplemental: str | None = None) -> str:
    """Generate an initial content outline for the provided topic."""
    system_prompt = custom_prompt or _default_planner_system_prompt()
    user_prompt = ""
    if supplemental:
        user_prompt += f"Supplemental information:\n{supplemental}\n\n"
    user_prompt += f"Create an outline for an article about: {topic}"

    response = openai.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    )
    outline = response.choices[0].message.content.strip()
    return outline


def continue_plan(
    topic: str,
    custom_prompt: str | None,
    conversation: list[dict[str, str]],
    user_message: str,
    supplemental: str | None = None,
) -> str:
    """Continue refining the outline based on the ongoing conversation."""

    system_prompt = custom_prompt or _default_planner_system_prompt()

    # Ensure the system prompt is the first message for OpenAI
    if supplemental:
        conversation = conversation + [{"role":"system","content":f"Supplemental information:\n{supplemental}"}]
    messages_for_openai: list[dict[str, str]] = [{"role": "system", "content": system_prompt}] + conversation

    response = openai.chat.completions.create(
        model="gpt-4",
        messages=messages_for_openai,
    )

    outline = response.choices[0].message.content.strip()
    return outline 

# --- Refinement System Prompts ---
_default_prompt_system = (
    "You are an expert AI prompt engineer. You help users craft clear, specific, high quality prompts for large language models. Always return ONLY the improved prompt with no extra commentary."
)

_default_supplement_system = (
    "You are a skilled technical writer. You refine user-provided supplemental information (reference text) by fixing grammar, simplifying where possible, and making the content concise while preserving meaning. Always return ONLY the improved text with no extra commentary."
)


def refine_text(text: str, mode: str, instruction: str | None = None, custom_system_prompt: str | None = None) -> str:
    """Refine a prompt or supplemental text based on mode. instruction is the user request."""
    system_prompt = custom_system_prompt or (
        _default_prompt_system if mode == "prompt" else _default_supplement_system
    )

    user_content = (
        f"Here is the current {'prompt' if mode=='prompt' else 'supplemental text'} to refine:\n---\n{text}\n---\n"
        + (instruction or "Please improve it.")
        + "\nReturn ONLY the refined version, no commentary."
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_content},
    ]

    try:
        import openai

        # Prefer GPT-4; fall back to GPT-3.5 if not available
        def chat_completion(model_name:str):
            # Prefer new SDK interface; fallback to legacy
            try:
                return openai.chat.completions.create(
                    model=model_name,
                    messages=messages,
                    max_tokens=2048,
                    temperature=0.7,
                )
            except AttributeError:
                # Older SDK (<1.0)
                return openai.ChatCompletion.create(
                    model=model_name,
                    messages=messages,
                    max_tokens=2048,
                    temperature=0.7,
                )

        try_model = "gpt-4o"
        try:
            completion = chat_completion(try_model)
        except Exception:
            completion = chat_completion("gpt-3.5-turbo")
        # Handle response structure difference
        if hasattr(completion, "choices"):
            return completion.choices[0].message.content.strip()
        else:  # openai>=1 returns object with choices list as attribute
            return completion.choices[0].message.content.strip()
    except Exception as e:
        # Fallback – return original text if OpenAI fails
        print("OpenAI refine_text error", e)
        return text 