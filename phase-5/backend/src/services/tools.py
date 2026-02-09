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
        tags: Optional[List[str]] = None,
        recurrence: Optional[Dict[str, Any]] = None
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
                tags=tags or [],
                recurrence=recurrence
            )
            self.session.add(task)
            self.session.commit()
            self.session.refresh(task)
            return {
                "task_id": str(task.id),
                "status": "created",
                "title": task.title,
                "priority": task.priority,
                "due_date": str(task.due_date) if task.due_date else None,
                "tags": task.tags,
                "recurrence": task.recurrence
            }
        except Exception as e:
            return {"error": str(e)}

    def list_tasks(
        self, 
        status: str = "all", 
        title: Optional[str] = None,
        priority: Optional[str] = None,
        tag: Optional[str] = None,
        sort_by: str = "created_at_desc"
    ) -> List[Dict[str, Any]]:
        """Retrieve tasks with advanced filters and sorting."""
        try:
            statement = select(Task).where(Task.user_id == self.user_id)
            if status == "pending":
                statement = statement.where(Task.completed == False)
            elif status == "completed":
                statement = statement.where(Task.completed == True)
            
            if title:
                statement = statement.where(col(Task.title).ilike(f"%{title}%"))
            
            if priority:
                statement = statement.where(Task.priority == priority)
            
            # Simplified tag filter (checks if tag exists in tags list)
            # In a real app with large data, we'd use GIN indexes or a join table
            
            tasks = self.session.exec(statement).all()
            
            # Post-processing filters (Tags)
            if tag:
                tasks = [t for t in tasks if tag in t.tags]

            # Sorting
            if sort_by == "due_date_asc":
                tasks.sort(key=lambda x: (x.due_date is None, x.due_date))
            elif sort_by == "priority_desc":
                p_map = {"high": 0, "medium": 1, "low": 2}
                tasks.sort(key=lambda x: p_map.get(x.priority, 1))
            elif sort_by == "title_asc":
                tasks.sort(key=lambda x: x.title.lower())
            else: # default created_at_desc
                tasks.sort(key=lambda x: x.created_at, reverse=True)

            return [
                {
                    "id": str(t.id),
                    "title": t.title,
                    "completed": t.completed,
                    "priority": t.priority,
                    "due_date": str(t.due_date) if t.due_date else None,
                    "tags": t.tags,
                    "recurrence": t.recurrence
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
                "title": task.title,
                "recurrence": task.recurrence # Needed for Recurring Task Service
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

    def update_task(
        self, 
        task_id: str, 
        title: Optional[str] = None, 
        description: Optional[str] = None,
        priority: Optional[str] = None,
        due_date: Optional[str] = None,
        tags: Optional[List[str]] = None,
        recurrence: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Modify task fields by ID."""
        try:
            t_uuid = uuid.UUID(task_id)
            task = self.session.get(Task, t_uuid)
            if not task or task.user_id != self.user_id:
                return {"error": "Task not found"}
            
            if title is not None:
                task.title = title
            if description is not None:
                task.description = description
            if priority is not None:
                task.priority = priority
            if due_date is not None:
                task.due_date = datetime.fromisoformat(due_date) if due_date else None
            if tags is not None:
                task.tags = tags
            if recurrence is not None:
                task.recurrence = recurrence
                
            self.session.add(task)
            self.session.commit()
            self.session.refresh(task)
            return {
                "task_id": str(task.id),
                "status": "updated",
                "title": task.title,
                "priority": task.priority,
                "due_date": str(task.due_date) if task.due_date else None,
                "tags": task.tags,
                "recurrence": task.recurrence
            }
        except Exception as e:
            return {"error": str(e)}