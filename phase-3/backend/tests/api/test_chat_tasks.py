from fastapi.testclient import TestClient
from src.main import app
import pytest
import uuid
from unittest.mock import patch, MagicMock

client = TestClient(app)

@patch("src.services.chat_service.OpenAI")
def test_chat_endpoint_exists(mock_openai):
    # Mock the OpenAI client instance and its response
    mock_client_instance = MagicMock()
    mock_openai.return_value = mock_client_instance
    
    mock_completion = MagicMock()
    mock_completion.choices = [
        MagicMock(message=MagicMock(content="Hello from AI", tool_calls=None))
    ]
    mock_client_instance.chat.completions.create.return_value = mock_completion

    user_id = str(uuid.uuid4())
    response = client.post(f"/api/{user_id}/chat", json={"message": "hello"})
    
    # We expect 200 OK because we mocked the external dependency
    assert response.status_code == 200
    data = response.json()
    assert data["response"] == "Hello from AI"
    assert "conversation_id" in data