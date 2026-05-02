from fastapi import APIRouter, Depends
from datetime import datetime
import uuid
from typing import Dict, Any

from app.models.schemas import WebhookPayload, WebhookResponse
from app.services.store import tasks_db, activity_stream_db, logger
from app.dependencies import get_api_key

router = APIRouter(prefix="/api/webhook", tags=["Webhook"])

def parse_message_with_llm(content: str) -> Dict[str, Any]:
    """
    Mock function simulating a Large Language Model (LLM) intent parser.
    In a production scenario (Phase 3), this would use LangChain + Google Gemini 1.5 Pro
    to perform entity extraction on natural language input.
    """
    # Simple heuristic to simulate an LLM categorizing an "update_status" intent
    if "delay" in content.lower() or "block" in content.lower():
        return {
            "intent": "update_status",
            "task_id": "TASK-123", # In prod, the LLM would extract the actual task ID
            "status": "blocked",
            "reason": content
        }
        
    # Default intent if no blocking language is detected
    return {
        "intent": "create_task",
        "title": content[:50] + "..." if len(content) > 50 else content,
        "description": content,
        "assigned_to": "Current User",
        "deadline": None
    }

@router.post("/ingest", response_model=WebhookResponse)
async def ingest_webhook(payload: WebhookPayload, api_key: str = Depends(get_api_key)):
    """
    Core ingestion engine for NexusFlow.
    Listens for incoming webhooks (e.g., from Slack or Teams), parses the natural 
    language intent, and dynamically mutates the organizational state (Database).
    """
    try:
        logger.info(f"Received webhook from {payload.source} by user {payload.user_id}")
        
        # 1. Parse the incoming natural language message
        parsed_data = parse_message_with_llm(payload.content)
        intent = parsed_data.get("intent")
        
        if not intent:
            raise ValueError("Failed to parse intent from LLM.")
        
        time_str = datetime.now().strftime("%H:%M:%S")
        
        # 2. State Mutation: Handle the parsed intent
        if intent == "create_task":
            # Generate a new actionable item based on the chat message
            new_task = {
                "id": str(uuid.uuid4())[:8],
                "title": parsed_data.get("title", "Untitled Task"),
                "description": parsed_data.get("description", ""),
                "assigned_to": parsed_data.get("assigned_to", "Unassigned"),
                "status": "pending"
            }
            tasks_db.append(new_task) # Persist to DB
            
            # Propagate an event to the Live Activity Stream
            activity_stream_db.append({
                "time": time_str,
                "msg": f"Task created: {new_task['title']}",
                "color": "border-blue-500/30"
            })
            logger.info(f"Created new task: {new_task['id']}")
            
        elif intent == "update_status":
            reason = parsed_data.get("reason", "Unknown block reason")
            # Propagate a critical alert to the Live Activity Stream
            activity_stream_db.append({
                "time": time_str,
                "msg": f"Status updated to blocked: {reason}",
                "color": "border-red-500/30"
            })
            
            # Mutate the existing task state to 'blocked'
            if tasks_db:
                tasks_db[-1]["status"] = "blocked" # Mocking finding the specific task
                logger.warning(f"Task {tasks_db[-1]['id']} marked as blocked.")
                
        return WebhookResponse(
            status="success", 
            message=f"Successfully processed intent: {intent}",
            data=parsed_data
        )
    
    except ValueError as ve:
        logger.error(f"Validation error during ingestion: {str(ve)}")
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        logger.error(f"Unexpected error during webhook processing: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during ingestion.")
