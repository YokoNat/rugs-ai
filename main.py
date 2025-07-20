import typer
from scripts.generate import generate_article
from scripts.critique_content import critique_content

app = typer.Typer()

@app.command()
def generate(topic: str = typer.Option(..., help="Topic for the article")):
    generate_article(topic)

@app.command()
def critique(file_path: str = typer.Option(..., help="Path to the file to critique")):
    critique_content(file_path)

if __name__ == "__main__":
    app()
