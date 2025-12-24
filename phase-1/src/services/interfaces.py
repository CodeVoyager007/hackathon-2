from typing import List, Optional, Protocol
from dataclasses import dataclass

@dataclass
class TaskDTO:
    id: int
    title: str
    description: str
    completed: bool

class ITaskService(Protocol):
    def add_task(self, title: str, description: str = "") -> TaskDTO:
        """
        Creates a new task.
        Raises: ValueError if title is empty.
        """
        ...

    def get_task(self, task_id: int) -> Optional[TaskDTO]:
        """Returns task by ID or None."""
        ...

    def list_tasks(self) -> List[TaskDTO]:
        """Returns all tasks ordered by ID."""
        ...

    def update_task(self, task_id: int, title: Optional[str] = None, description: Optional[str] = None) -> TaskDTO:
        """
        Updates fields if provided.
        Raises: TaskNotFoundError if id not found.
        """
        ...

    def delete_task(self, task_id: int) -> bool:
        """
        Deletes task. Returns True if deleted, False if not found.
        """
        ...

    def toggle_complete(self, task_id: int) -> TaskDTO:
        """
        Toggles completion status.
        Raises: TaskNotFoundError if id not found.
        """
        ...
