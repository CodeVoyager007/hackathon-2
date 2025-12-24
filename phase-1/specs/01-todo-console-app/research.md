# Research & Decisions: Todo In-Memory Console App

## Technical Decisions

### 1. UI/CLI Framework
- **Decision**: Use `rich` for output formatting + pure Python `input()` loop for interaction.
- **Rationale**: The requirements specify "Via terminal" and simple 5 operations. `rich` provides beautiful tables for the "View Tasks" requirement (FR-004) with minimal boilerplate. A complex CLI framework like `typer` or `click` might be overkill for a simple REPL (Read-Eval-Print Loop) style app unless command-line arguments are strictly required (spec implies interactive menu: "User chooses...").
- **Alternatives**:
  - `typer`/`click`: Good for command-based CLI (e.g., `todo add "Buy Milk"`), but spec implies "User chooses to Add Task" -> "User provides title", which sounds interactive.
  - `curses`/`urwid`: Too complex/low-level.
  - Plain `print()`: Functional but meets "Clean" standard better if formatted nicely.

### 2. ID Generation Strategy
- **Decision**: Simple incremental integer counter (`next_id = 1`, increment on add).
- **Rationale**: Simplest implementation for in-memory lists. No need for UUIDs in single-session transient app. Meets "Unique Integer ID" requirement.

### 3. Data Structure
- **Decision**: Dictionary of dictionaries `{id: TaskObj}` or List of objects `[TaskObj]`.
- **Selected**: Dictionary `{id: Task}`.
- **Rationale**: O(1) lookup for Update/Delete/Mark operations which happen by ID.

### 4. Testing Strategy
- **Decision**: `pytest` with `io` mocking.
- **Rationale**: Standard Python testing. `unittest.mock.patch` on `builtins.input` and `sys.stdout` will be used to test the UI layer. Service layer tested with direct method calls.

## Clarifications Resolved (Implicit)

- **Auth**: None required (Single user, local session).
- **Persistence**: Explicitly None (In-Memory).
- **Concurrency**: Single threaded implied.
