from typing import List, Optional, Dict
from src.models.task import Task
from src.services.interfaces import ITaskService, TaskDTO

class TaskNotFoundError(Exception):
    pass

class TaskService(ITaskService):
    def __init__(self):
        self._tasks: Dict[int, Task] = {}
        self._next_id: int = 1

    def _to_dto(self, task: Task) -> TaskDTO:
        return TaskDTO(
            id=task.id,
            title=task.title,
            description=task.description,
            completed=task.completed
        )

    def add_task(self, title: str, description: str = "") -> TaskDTO:
        task = Task(id=self._next_id, title=title, description=description)
        self._tasks[self._next_id] = task
        self._next_id += 1
        return self._to_dto(task)

    def get_task(self, task_id: int) -> Optional[TaskDTO]:
        task = self._tasks.get(task_id)
        if not task:
            return None
        return self._to_dto(task)

    def list_tasks(self) -> List[TaskDTO]:
        return [self._to_dto(task) for task in sorted(self._tasks.values(), key=lambda t: t.id)]

    def update_task(self, task_id: int, title: Optional[str] = None, description: Optional[str] = None) -> TaskDTO:
        task = self._tasks.get(task_id)
        if not task:
            raise TaskNotFoundError(f"Task {task_id} not found")
        
        if title is not None:
            # Re-validate via Task init logic or direct check
            if not title.strip():
                 # Should raise ValueError as per requirement, reusing Task validation would be ideal but modifying fields directly requires care
                 raise ValueError("Title cannot be empty")
            task.title = title.strip()
            
        if description is not None:
            task.description = description
            
        return self._to_dto(task)

    def delete_task(self, task_id: int) -> bool:
        if task_id in self._tasks:
            del self._tasks[task_id]
            return True
        return False

    def toggle_complete(self, task_id: int) -> TaskDTO:
        task = self._tasks.get(task_id)
        if not task:
            raise TaskNotFoundError(f"Task {task_id} not found")
        
        task.completed = True
        return self._to_dto(task)
