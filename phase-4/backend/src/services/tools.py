from typing import List, Optional, Dict, Any
from sqlmodel import Session, select, col
from src.models.task import Task
import uuid
from datetime import datetime

class TaskTools:
    """
    Stateless MCP Tools for Task Operations.
    """
    def __init__(self, session: Session, user_id: str):
        self.session = session
        self.user_id = user_id

    def add_task(
        self, 
        title: str, 
        description: Optional[str] = None,
        priority: Optional[str] = "medium",
        due_date: Optional[str] = None,
        tags: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Create a new task with full details."""
        try:
            due_date_iso = datetime.fromisoformat(due_date) if due_date else None
            task = Task(
                title=title, 
                description=description, 
                user_id=self.user_id,
                priority=priority,
                due_date=due_date_iso,
                tags=tags or []
            )
            self.session.add(task)
            self.session.commit()
            self.session.refresh(task)
            return {
                "task_id": str(task.id),
                "status": "created",
                "title": task.title,
                "priority": task.priority,
                "due_date": str(task.due_date),
                "tags": task.tags
            }
        except Exception as e:
            return {"error": str(e)}

    def list_tasks(self, status: str = "all", title: Optional[str] = None) -> List[Dict[str, Any]]:
        """Retrieve tasks from the list, with optional filters for status or title."""
        try:
            statement = select(Task).where(Task.user_id == self.user_id)
            if status == "pending":
                statement = statement.where(Task.completed == False)
            elif status == "completed":
                statement = statement.where(Task.completed == True)
            
            if title:
                statement = statement.where(col(Task.title).ilike(f"%{title}%")) # Case-insensitive search
                
            tasks = self.session.exec(statement).all()
            return [
                {
                    "id": str(t.id),
                    "title": t.title,
                    "completed": t.completed
                } for t in tasks
            ]
        except Exception as e:
            return [{"error": str(e)}]

    def complete_task(self, task_id: str) -> Dict[str, Any]:
        """Mark a task as complete by ID."""
        try:
            t_uuid = uuid.UUID(task_id)
            task = self.session.get(Task, t_uuid)
            if not task or task.user_id != self.user_id:
                return {"error": "Task not found"}
            
            task.completed = True
            self.session.add(task)
            self.session.commit()
            self.session.refresh(task)
            return {
                "task_id": str(task.id),
                "status": "completed",
                "title": task.title
            }
        except Exception as e:
            return {"error": str(e)}

    def delete_task(self, task_id: str) -> Dict[str, Any]:
        """Remove a task from the list by ID."""
        try:
            t_uuid = uuid.UUID(task_id)
            task = self.session.get(Task, t_uuid)
            if not task or task.user_id != self.user_id:
                return {"error": "Task not found"}
            
            title = task.title
            self.session.delete(task)
            self.session.commit()
            return {
                "task_id": str(task_id),
                "status": "deleted",
                "title": title
            }
        except Exception as e:
            return {"error": str(e)}

    def update_task(self, task_id: str, title: Optional[str] = None, description: Optional[str] = None) -> Dict[str, Any]:
        """Modify task title or description by ID."""
        try:
            t_uuid = uuid.UUID(task_id)
            task = self.session.get(Task, t_uuid)
            if not task or task.user_id != self.user_id:
                return {"error": "Task not found"}
            
            if title:
                task.title = title
            if description:
                task.description = description
                
            self.session.add(task)
            self.session.commit()
            self.session.refresh(task)
            return {
                "task_id": str(task.id),
                "status": "updated",
                "title": task.title
            }
        except Exception as e:
            return {"error": str(e)}