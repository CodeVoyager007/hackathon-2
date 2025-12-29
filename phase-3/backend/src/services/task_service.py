from sqlmodel import Session, select, col, func
from src.models.task import Task, Recurrence
from src.schemas.task import TaskCreate, TaskUpdate
from typing import Optional, List
from datetime import datetime, timedelta
import uuid

def create_task(session: Session, task_in: TaskCreate, user_id: str) -> Task:
    task = Task.model_validate(task_in, update={"user_id": user_id})
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

def get_tasks(
    session: Session, 
    user_id: str, 
    search: Optional[str] = None,
    priority: Optional[str] = None,
    status: Optional[str] = None, # 'todo', 'done'
    sort_by: Optional[str] = None, # 'date_asc', 'date_desc', 'priority'
    tag: Optional[str] = None
) -> List[Task]:
    statement = select(Task).where(Task.user_id == user_id)
    
    # Filtering
    if search:
        statement = statement.where(col(Task.title).contains(search) | col(Task.description).contains(search))
    if priority and priority != "all":
        statement = statement.where(Task.priority == priority)
    if status:
        if status == "todo":
            statement = statement.where(Task.completed == False)
        elif status == "done":
            statement = statement.where(Task.completed == True)
    if tag:
        statement = statement.where(col(Task.tags).contains([tag]))

    # Sorting
    if sort_by == "date_asc":
        statement = statement.order_by(Task.due_date.asc())
    elif sort_by == "date_desc":
        statement = statement.order_by(Task.due_date.desc())
    elif sort_by == "priority":
        statement = statement.order_by(Task.priority.desc()) 
    else:
        statement = statement.order_by(Task.created_at.desc())

    return session.exec(statement).all()

def get_task(session: Session, task_id: uuid.UUID, user_id: str) -> Optional[Task]:
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    return session.exec(statement).first()

def update_task(session: Session, db_task: Task, task_in: TaskUpdate) -> Task:
    task_in_data = task_in.model_dump(exclude_unset=True)

    # Recurrence Logic: If completing a recurring task, create next instance
    if task_in_data.get("completed") and db_task.recurrence != Recurrence.none.value and not db_task.completed:
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
                user_id=db_task.user_id
            )
            session.add(new_task)

    db_task.sqlmodel_update(task_in_data)
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

def delete_task(session: Session, db_task: Task):
    session.delete(db_task)
    session.commit()