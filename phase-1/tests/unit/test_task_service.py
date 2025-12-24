import pytest
from src.services.task_service import TaskService, TaskNotFoundError

def test_add_task(task_service):
    dto = task_service.add_task("Buy Milk", "Go to store")
    assert dto.id == 1
    assert dto.title == "Buy Milk"
    assert dto.description == "Go to store"
    assert dto.completed is False
    
    tasks = task_service.list_tasks()
    assert len(tasks) == 1
    assert tasks[0] == dto

def test_add_task_empty_title_raises_error(task_service):
    with pytest.raises(ValueError):
        task_service.add_task("")
    
    with pytest.raises(ValueError):
        task_service.add_task("   ")

def test_add_task_increments_id(task_service):
    t1 = task_service.add_task("First")
    t2 = task_service.add_task("Second")
    assert t1.id == 1
    assert t2.id == 2

def test_list_tasks(task_service):
    assert task_service.list_tasks() == []
    task_service.add_task("A")
    task_service.add_task("B")
    tasks = task_service.list_tasks()
    assert len(tasks) == 2
    assert tasks[0].title == "A"
    assert tasks[1].title == "B"

def test_toggle_complete(task_service):
    t = task_service.add_task("Test")
    assert not t.completed
    
    updated = task_service.toggle_complete(t.id)
    assert updated.completed
    
    updated = task_service.toggle_complete(t.id)
    assert not updated.completed

def test_toggle_complete_not_found(task_service):
    with pytest.raises(TaskNotFoundError):
        task_service.toggle_complete(999)

def test_update_task(task_service):
    t = task_service.add_task("Old", "Desc")
    
    updated = task_service.update_task(t.id, title="New")
    assert updated.title == "New"
    assert updated.description == "Desc"
    
    updated = task_service.update_task(t.id, description="New Desc")
    assert updated.title == "New"
    assert updated.description == "New Desc"

def test_update_task_not_found(task_service):
    with pytest.raises(TaskNotFoundError):
        task_service.update_task(999, title="New")

def test_delete_task(task_service):
    t = task_service.add_task("To Delete")
    assert task_service.delete_task(t.id) is True
    assert task_service.list_tasks() == []
    
    assert task_service.delete_task(t.id) is False