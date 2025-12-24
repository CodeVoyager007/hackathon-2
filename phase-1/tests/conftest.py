import pytest
from src.services.task_service import TaskService

@pytest.fixture
def task_service():
    return TaskService()
