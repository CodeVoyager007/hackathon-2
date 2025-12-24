# Internal Contracts (Service Layer)

The `TaskService` defines the core application boundary.

## Interface Definition

```python
from typing import List, Optional
from dataclasses import dataclass

@dataclass
class TaskDTO:
    id: int
    title: string
    description: string
    completed: bool

class ITaskService:
    def add_task(self, title: str, description: str = "") -> TaskDTO:
        """
        Creates a new task.
        Raises: ValueError if title is empty.
        """
        pass

    def get_task(self, task_id: int) -> Optional[TaskDTO]:
        """Returns task by ID or None."""
        pass

    def list_tasks(self) -> List[TaskDTO]:
        """Returns all tasks ordered by ID."""
        pass

    def update_task(self, task_id: int, title: Optional[str] = None, description: Optional[str] = None) -> TaskDTO:
        """
        Updates fields if provided.
        Raises: TaskNotFoundError if id not found.
        """
        pass

    def delete_task(self, task_id: int) -> bool:
        """
        Deletes task. Returns True if deleted, False if not found.
        (Or raise TaskNotFoundError - decision: Raise for consistency)
        """
        pass

    def toggle_complete(self, task_id: int) -> TaskDTO:
        """
        Toggles completion status.
        Raises: TaskNotFoundError if id not found.
        """
        pass
```

## UI Interaction Contract (Console)

**Main Menu**:
1. Add Task
2. View Tasks
3. Update Task
4. Delete Task
5. Mark Complete
6. Exit

**Input Flows**:
- **Add**: `Title: [input]` -> `Description: [input]` -> Output: "Task [ID] added."
- **Update**: `ID: [input]` -> `New Title (Enter to skip): [input]` -> `New Description (Enter to skip): [input]` -> Output: "Task updated."
- **Delete/Mark**: `ID: [input]` -> Output: "Task [ID] [deleted/marked]."
