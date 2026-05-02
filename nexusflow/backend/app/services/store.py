import logging
import os
import google.cloud.logging

# Initialize Google Cloud Logging if in production environment
def setup_logging():
    if os.environ.get("K_SERVICE"):  # This env var is present in Cloud Run
        client = google.cloud.logging.Client()
        client.setup_logging()
    
    logger = logging.getLogger("nexusflow")
    logger.setLevel(logging.INFO)
    return logger

logger = setup_logging()

# In-memory stores for MVP
tasks_db = []
activity_stream_db = [
    {"time": "2 mins ago", "msg": "Slack intent parsed: Task 'Update Q3 Goals' assigned to Sarah.", "color": "border-blue-500/30"},
    {"time": "15 mins ago", "msg": "Dependency Warning: Design delivery delayed, affecting Engineering sprint.", "color": "border-red-500/30"},
    {"time": "1 hour ago", "msg": "Email ingested: New client requirement added to Project Alpha.", "color": "border-purple-500/30"}
]
