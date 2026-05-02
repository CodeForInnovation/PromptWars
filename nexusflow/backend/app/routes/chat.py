from fastapi import APIRouter, HTTPException, Depends
import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

from app.models.schemas import ChatRequest, ChatResponse
from app.services.store import tasks_db, activity_stream_db, logger
from app.dependencies import get_api_key

load_dotenv()

router = APIRouter(prefix="/api/chat", tags=["AI Assistant"])

# Configure Gemini AI
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    # Use gemini-1.5-flash as default for fast responses, 
    # but could be upgraded to pro for complex tasks
    model = genai.GenerativeModel('gemini-1.5-flash') 
else:
    model = None
    logger.warning("GEMINI_API_KEY not found in environment. AI Chat will be disabled.")

@router.post("/", response_model=ChatResponse)
async def chat_with_nexus(request: ChatRequest):
    """
    Endpoint for the Nexus AI Chat Assistant.
    It injects the live organizational state into the prompt to provide context-aware answers.
    """
    if not model:
        raise HTTPException(status_code=503, detail="AI Assistant is currently unavailable due to missing API key configuration.")
    
    try:
        # Build the system context
        context = {
            "current_tasks": tasks_db,
            "recent_activity": list(reversed(activity_stream_db))[:5]
        }
        
        prompt = f"""
        You are Nexus AI, the intelligent assistant for the NexusFlow platform.
        Your goal is to help users understand the current state of their organization's tasks and activities.
        
        Here is the live JSON context of the organization:
        {json.dumps(context, indent=2)}
        
        User Query: {request.message}
        
        Provide a concise, helpful, and professional response. Only reference tasks or activities that exist in the context provided. If you don't know the answer based on the context, say so.
        """
        
        logger.info(f"Generating AI response for query: {request.message[:50]}")
        response = model.generate_content(prompt)
        
        return ChatResponse(reply=response.text)
        
    except Exception as e:
        logger.error(f"Error communicating with Gemini API: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while generating the AI response.")
