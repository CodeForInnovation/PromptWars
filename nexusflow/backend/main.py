from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import json
from datetime import datetime
import uuid

app = FastAPI(title="NexusFlow Core API")

# Add CORS middleware to allow Next.js to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for demo purposes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory stores for MVP
tasks_db = []
activity_stream_db = [
    {"time": "2 mins ago", "msg": "Slack intent parsed: Task 'Update Q3 Goals' assigned to Sarah.", "color": "border-blue-500/30"},
    {"time": "15 mins ago", "msg": "Dependency Warning: Design delivery delayed, affecting Engineering sprint.", "color": "border-red-500/30"},
    {"time": "1 hour ago", "msg": "Email ingested: New client requirement added to Project Alpha.", "color": "border-purple-500/30"}
]

class WebhookPayload(BaseModel):
    source: str
    content: str
    user_id: str

# Mock function for LLM parsing
def parse_message_with_llm(content: str):
    # In a real scenario, this uses LangChain + Gemini to extract entities
    if "delay" in content.lower():
        return {
            "intent": "update_status",
            "task_id": "TASK-123",
            "status": "blocked",
            "reason": content
        }
    return {
        "intent": "create_task",
        "title": content[:50] + "..." if len(content) > 50 else content,
        "description": content,
        "assigned_to": "Current User",
        "deadline": None
    }

@app.get("/")
def read_root():
    return {"status": "ok", "service": "NexusFlow Intelligence Layer"}

@app.get("/api/dashboard")
def get_dashboard_data():
    blocked = len([t for t in tasks_db if t.get("status") == "blocked"])
    total_tasks = len(tasks_db)
    health = 92
    if blocked > 0:
        health = max(0, 92 - (blocked * 5)) # Simple mock health calculation
        
    return {
        "health": health,
        "active_bots": 14,
        "blocked_dependencies": 3 + blocked,
        "activity_stream": list(reversed(activity_stream_db))[:10]
    }

@app.get("/api/tasks")
def get_tasks():
    return tasks_db

@app.post("/api/webhook/ingest")
async def ingest_webhook(payload: WebhookPayload):
    # 1. Parse content with LLM (mocked)
    parsed_data = parse_message_with_llm(payload.content)
    intent = parsed_data.get("intent")
    
    # Update Activity Stream
    time_str = datetime.now().strftime("%H:%M:%S")
    
    if intent == "create_task":
        new_task = {
            "id": str(uuid.uuid4())[:8],
            "title": parsed_data["title"],
            "description": parsed_data["description"],
            "assigned_to": parsed_data["assigned_to"],
            "status": "pending"
        }
        tasks_db.append(new_task)
        activity_stream_db.append({
            "time": time_str,
            "msg": f"Task created: {new_task['title']}",
            "color": "border-blue-500/30"
        })
    elif intent == "update_status":
        activity_stream_db.append({
            "time": time_str,
            "msg": f"Status updated to blocked: {parsed_data['reason']}",
            "color": "border-red-500/30"
        })
        # Mock finding and updating task
        if tasks_db:
            tasks_db[-1]["status"] = "blocked"
            
    return {
        "status": "success", 
        "message": f"Successfully processed intent: {intent}",
        "data": parsed_data
    }



if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
