from sqlmodel import Session, select, col, func
from src.models.task import Task, Recurrence
from src.schemas.task import TaskCreate, TaskUpdate
from typing import Optional, List
from datetime import datetime, timedelta
import uuid

def create_task(session: Session, task_in: TaskCreate, owner_id: uuid.UUID) -> Task:
    task = Task.model_validate(task_in, update={"owner_id": owner_id})
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

def get_tasks(
    session: Session, 
    owner_id: uuid.UUID, 
    search: Optional[str] = None,
    priority: Optional[str] = None,
    status: Optional[str] = None, # 'todo', 'done'
    sort_by: Optional[str] = None, # 'date_asc', 'date_desc', 'priority'
    tag: Optional[str] = None
) -> List[Task]:
    statement = select(Task).where(Task.owner_id == owner_id)
    
    # Filtering
    if search:
        statement = statement.where(col(Task.title).contains(search) | col(Task.description).contains(search))
    if priority and priority != "all":
        statement = statement.where(Task.priority == priority)
    if status:
        if status == "todo":
            statement = statement.where(Task.is_completed == False)
        elif status == "done":
            statement = statement.where(Task.is_completed == True)
    if tag:
        # Check if tag is in the JSON list
        # Note: This syntax works for Postgres JSONB to find existence in array
        # We pass it as a JSON-compatible string or list depending on dialect.
        # For simple string matching in JSON array, standard SQLModel/SA might need specific dialect support.
        # Simplest fallback for broad compat:
        # statement = statement.where(func.json_array_length(Task.tags) > 0) # Just valid json
        # But we want specific tag.
        # Try: Task.tags.contains([tag]) if it's a JSON array
        statement = statement.where(col(Task.tags).contains([tag]))

    # Sorting
    if sort_by == "date_asc":
        statement = statement.order_by(Task.due_date.asc())
    elif sort_by == "date_desc":
        statement = statement.order_by(Task.due_date.desc())
    elif sort_by == "priority":
        # Custom sort? high -> medium -> low. SQL sort might be alpha "high", "low", "medium"
        # For simplicity, we can do client side or rely on updated_at
        statement = statement.order_by(Task.priority.desc()) 
    else:
        statement = statement.order_by(Task.created_at.desc())

    return session.exec(statement).all()

def get_task(session: Session, task_id: uuid.UUID, owner_id: uuid.UUID) -> Optional[Task]:
    statement = select(Task).where(Task.id == task_id, Task.owner_id == owner_id)
    return session.exec(statement).first()

def update_task(session: Session, db_task: Task, task_in: TaskUpdate) -> Task:
    # Recurrence Logic: If completing a recurring task, create next instance
    if task_in.is_completed and db_task.recurrence != Recurrence.none.value and not db_task.is_completed:
        # Create next task
        next_due = None
        if db_task.due_date:
            if db_task.recurrence == Recurrence.daily.value:
                next_due = db_task.due_date + timedelta(days=1)
            elif db_task.recurrence == Recurrence.weekly.value:
                next_due = db_task.due_date + timedelta(weeks=1)
            elif db_task.recurrence == Recurrence.monthly.value:
                next_due = db_task.due_date + timedelta(days=30) # approx
        
        if next_due:
            new_task = Task(
                title=db_task.title,
                description=db_task.description,
                priority=db_task.priority,
                tags=db_task.tags,
                recurrence=db_task.recurrence,
                due_date=next_due,
                owner_id=db_task.owner_id
            )
            session.add(new_task)

    task_data = task_in.model_dump(exclude_unset=True)
    db_task.sqlmodel_update(task_data)
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

def delete_task(session: Session, db_task: Task):
    session.delete(db_task)
    session.commit()