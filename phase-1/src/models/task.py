from dataclasses import dataclass, field

@dataclass
class Task:
    id: int
    title: str
    description: str = ""
    completed: bool = False

    def __post_init__(self):
        if not self.title or not self.title.strip():
            raise ValueError("Title cannot be empty")
        self.title = self.title.strip()
