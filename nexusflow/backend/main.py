from fastapi import FastAPI, Request
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="NexusFlow Core API")

class WebhookPayload(BaseModel):
    source: str
    content: str
    user_id: str

@app.get("/")
def read_root():
    return {"status": "ok", "service": "NexusFlow Intelligence Layer"}

import json
from datetime import datetime

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
        "title": "New Action Item",
        "description": content,
        "assigned_to": "unassigned",
        "deadline": None
    }

@app.post("/api/webhook/ingest")
async def ingest_webhook(payload: WebhookPayload):
    # 1. Parse content with LLM (mocked)
    parsed_data = parse_message_with_llm(payload.content)
    
    # 2. Extract entities and intents
    intent = parsed_data.get("intent")
    
    # 3. Create or map task in Graph DB (mocked log)
    print(f"[{datetime.now().isoformat()}] Received webhook from {payload.source}")
    print(f"Parsed Intent: {intent} | Data: {json.dumps(parsed_data)}")
    
    if intent == "create_task":
        # Mocking Neo4j query
        # db_conn.query("CREATE (t:Task {title: $title})", {"title": parsed_data["title"]})
        pass
        
    return {
        "status": "success", 
        "message": f"Successfully processed intent: {intent}",
        "data": parsed_data
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
