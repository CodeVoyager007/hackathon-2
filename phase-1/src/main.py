import sys
import os

# Add project root to sys.path so we can import 'src'
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.services.task_service import TaskService, TaskNotFoundError
from src.ui.console import TodoConsole

console_ui = TodoConsole()
service = TaskService()

def main():
    console_ui.display_welcome()
    while True:
        try:
            choice = console_ui.display_menu()
            
            if choice == "6":
                print("Goodbye!")
                break
            elif choice == "1":
                title, description = console_ui.get_add_task_input()
                task = service.add_task(title, description)
                console_ui.show_task_added(task)
            elif choice == "2":
                tasks = service.list_tasks()
                console_ui.show_tasks(tasks)
            elif choice == "3":
                task_id = console_ui.get_task_id("Enter Task ID to update")
                title, description = console_ui.get_update_input()
                try:
                    task = service.update_task(task_id, title, description)
                    console_ui.show_task_updated(task)
                except TaskNotFoundError:
                    console_ui.show_error(f"Task {task_id} not found")
            elif choice == "4":
                task_id = console_ui.get_task_id("Enter Task ID to delete")
                if console_ui.confirm_delete(task_id):
                    if service.delete_task(task_id):
                        console_ui.show_task_deleted(task_id)
                    else:
                        console_ui.show_error(f"Task {task_id} not found")
            elif choice == "5":
                task_id = console_ui.get_task_id("Enter Task ID to toggle complete")
                try:
                    task = service.toggle_complete(task_id)
                    console_ui.show_task_completed(task)
                except TaskNotFoundError:
                    console_ui.show_error(f"Task {task_id} not found")
                    
        except ValueError as e:
            console_ui.show_error(str(e))
        except Exception as e:
            console_ui.show_error(f"Unexpected error: {str(e)}")

if __name__ == "__main__":
    main()
