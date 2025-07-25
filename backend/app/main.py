from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.routes import generate, critique, projects, prompts, planner, supplementals, assistant, settings as settings_route


app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generate.router)
app.include_router(critique.router)
app.include_router(projects.router)
app.include_router(prompts.router)
app.include_router(planner.router)
app.include_router(supplementals.router)
app.include_router(assistant.router)
app.include_router(settings_route.router) 