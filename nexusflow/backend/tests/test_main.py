import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.dependencies import API_KEY

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_get_dashboard_data():
    response = client.get("/api/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "health" in data
    assert "activity_stream" in data

def test_ingest_webhook_unauthorized():
    payload = {
        "source": "slack",
        "content": "Delay the task",
        "user_id": "u123"
    }
    response = client.post("/api/webhook/ingest", json=payload)
    # Should fail due to missing API Key
    assert response.status_code == 403

def test_ingest_webhook_authorized():
    payload = {
        "source": "slack",
        "content": "Create a new presentation for tomorrow",
        "user_id": "u123"
    }
    headers = {
        "Authorization": f"Bearer {API_KEY}"
    }
    response = client.post("/api/webhook/ingest", json=payload, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["data"]["intent"] == "create_task"
