# Quickstart: Todo In-Memory Console App

## Prerequisites

- Python 3.13+
- `uv` package manager

## Setup

1. **Initialize Environment**:
   ```bash
   uv venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   uv pip install rich
   ```

2. **Run Application**:
   ```bash
   python src/main.py
   ```

## Usage Guide

1. **Start the App**: Run the command above. You will see a menu.
2. **Add Task**: Select option 1. Enter a title (e.g., "Buy Milk"). Description is optional.
3. **View Tasks**: Select option 2. You will see a table of tasks.
4. **Update/Delete/Mark**: Select corresponding options and provide the **ID** of the task (visible in View Tasks).
5. **Exit**: Select option 6. **Warning**: All data is lost on exit.

## Developer Notes

- **Tests**: Run `pytest` to execute unit and integration tests.
- **Code Structure**:
  - `src/models`: Data structures
  - `src/services`: Logic
  - `src/ui`: Console interaction
