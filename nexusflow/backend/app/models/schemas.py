from pydantic import BaseModel, Field
from typing import List, Optional

class WebhookPayload(BaseModel):
    source: str = Field(..., description="Source of the webhook, e.g., slack, email")
    content: str = Field(..., description="The natural language content to be parsed")
    user_id: str = Field(..., description="ID of the user sending the webhook")

class ActivityItem(BaseModel):
    time: str
    msg: str
    color: str

class DashboardData(BaseModel):
    health: int
    active_bots: int
    blocked_dependencies: int
    activity_stream: List[ActivityItem]

class TaskResponse(BaseModel):
    id: str
    title: str
    description: str
    assigned_to: str
    status: str

class WebhookResponse(BaseModel):
    status: str
    message: str
    data: dict

class ChatRequest(BaseModel):
    message: str = Field(..., description="The user's query to the AI assistant")

class ChatResponse(BaseModel):
    reply: str = Field(..., description="The AI's response")
