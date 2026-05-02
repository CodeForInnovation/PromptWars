from fastapi import APIRouter, HTTPException
from typing import List

from app.models.schemas import DashboardData, TaskResponse
from app.services.store import tasks_db, activity_stream_db, logger

router = APIRouter(prefix="/api", tags=["Dashboard"])

@router.get("/dashboard", response_model=DashboardData)
def get_dashboard_data():
    """
    Returns aggregated metrics for the Executive Heatmap.
    Calculates the 'Project Health' score dynamically based on the number of blocked dependencies.
    """
    try:
        logger.info("Fetching dashboard data")
        
        # Calculate how many tasks are currently halting progress
        blocked = len([t for t in tasks_db if t.get("status") == "blocked"])
        
        # Base health is 92%. Deduct 5% for every blocked dependency.
        health = 92
        if blocked > 0:
            health = max(0, 92 - (blocked * 5))
            
        return DashboardData(
            health=health,
            active_bots=14,
            blocked_dependencies=3 + blocked,
            activity_stream=list(reversed(activity_stream_db))[:10]
        )
    except Exception as e:
        logger.error(f"Error fetching dashboard data: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error while fetching dashboard data.")

@router.get("/tasks", response_model=List[TaskResponse])
def get_tasks():
    """
    Returns the granular list of pending/blocked tasks for the Focus Mode queue.
    """
    try:
        logger.info("Fetching tasks list")
        return [TaskResponse(**task) for task in tasks_db]
    except Exception as e:
        logger.error(f"Error fetching tasks: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error while fetching tasks.")
