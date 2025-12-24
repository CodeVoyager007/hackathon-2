import pytest
from unittest.mock import patch, MagicMock
from src.services.task_service import TaskService
from src.ui.console import TodoConsole

def test_full_flow_add_view_delete():
    # Mock Console and Prompt
    with patch("src.ui.console.Prompt.ask") as mock_ask, \
         patch("src.ui.console.console.print") as mock_print:
         
        service = TaskService()
        console = TodoConsole()
        
        # 1. Add Task
        mock_ask.side_effect = ["Buy Milk", ""] # Title, Description
        title, desc = console.get_add_task_input()
        task = service.add_task(title, desc)
        assert task.id == 1
        assert task.title == "Buy Milk"
        
        # 2. View Tasks
        # Capture output? 
        console.show_tasks(service.list_tasks())
        # Verify print was called with Table
        assert mock_print.called
        
        # 3. Delete Task
        service.delete_task(task.id)
        assert len(service.list_tasks()) == 0
