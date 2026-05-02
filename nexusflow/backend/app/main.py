from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.routes import webhook, dashboard, chat

app = FastAPI(title="NexusFlow Core API", version="1.1.0")

# Tightened CORS for security
FRONTEND_URL = os.environ.get("FRONTEND_URL", "https://nexusflow-frontend-687579320432.us-central1.run.app")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(webhook.router)
app.include_router(dashboard.router)
app.include_router(chat.router)

@app.get("/")
def read_root():
    return {"status": "ok", "service": "NexusFlow Intelligence Layer (Production)"}
