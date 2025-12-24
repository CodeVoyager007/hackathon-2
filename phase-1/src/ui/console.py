from rich.console import Console
from rich.prompt import Prompt, Confirm
from rich.table import Table
from typing import Tuple, Optional, List
from src.services.interfaces import TaskDTO

console = Console()

class TodoConsole:
    def display_welcome(self):
        console.print("[bold blue]Todo Console App[/bold blue]")

    def display_menu(self) -> str:
        console.print("\n[bold]Menu:[/bold]")
        console.print("1. Add Task")
        console.print("2. View Tasks")
        console.print("3. Update Task")
        console.print("4. Delete Task")
        console.print("5. Mark Complete")
        console.print("6. Exit")
        return Prompt.ask("Select option", choices=["1", "2", "3", "4", "5", "6"])

    def get_add_task_input(self) -> Tuple[str, str]:
        while True:
            title = Prompt.ask("Title")
            if title.strip():
                break
            console.print("[red]Title cannot be empty[/red]")
            
        description = Prompt.ask("Description", default="")
        return title, description

    def get_task_id(self, prompt: str = "Enter Task ID") -> int:
        while True:
            id_str = Prompt.ask(prompt)
            if id_str.isdigit():
                return int(id_str)
            console.print("[red]ID must be a number[/red]")

    def get_update_input(self) -> Tuple[Optional[str], Optional[str]]:
        console.print("[dim](Press Enter to keep current value)[/dim]")
        title = Prompt.ask("New Title", default=None)
        description = Prompt.ask("New Description", default=None)
        
        # Prompt.ask with default=None and no user input returns None?
        # Rich Prompt behavior: if default is None, it waits for input.
        # But we want "Enter to skip".
        # Let's use allow_empty=True if supported or check for empty string.
        # Actually Prompt.ask returns string. If default is provided, it returns default.
        # If I want optional update, I should just ask.
        # Let's re-implement simpler.
        
        title_in = Prompt.ask("New Title (leave blank to keep)", default="")
        desc_in = Prompt.ask("New Description (leave blank to keep)", default="")
        
        return (title_in if title_in else None), (desc_in if desc_in else None)

    def confirm_delete(self, task_id: int) -> bool:
        return Confirm.ask(f"Are you sure you want to delete Task {task_id}?")

    def show_task_added(self, task: TaskDTO):
        console.print(f"[green]Task {task.id} added.[/green]")

    def show_task_updated(self, task: TaskDTO):
        console.print(f"[green]Task {task.id} updated.[/green]")

    def show_task_deleted(self, task_id: int):
        console.print(f"[green]Task {task_id} deleted.[/green]")

    def show_task_completed(self, task: TaskDTO):
        status = "Completed" if task.completed else "Incomplete"
        console.print(f"[green]Task {task.id} marked as {status}.[/green]")

    def show_error(self, message: str):
        console.print(f"[red]Error: {message}[/red]")

    def show_tasks(self, tasks: List[TaskDTO]):
        if not tasks:
            console.print("[yellow]No tasks found.[/yellow]")
            return

        table = Table(show_header=True, header_style="bold magenta")
        table.add_column("ID", style="dim", width=6)
        table.add_column("Status", width=10)
        table.add_column("Title")
        table.add_column("Description")

        for task in tasks:
            status = "[x]" if task.completed else "[ ]"
            table.add_row(str(task.id), status, task.title, task.description)
        
        console.print(table)
