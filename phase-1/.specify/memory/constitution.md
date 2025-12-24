<!--
Sync Impact Report:
- Version: New → 1.0.0
- Principles: Established Principles I-VI (Zero Manual Coding, Spec-Driven Development, Clean Architecture, In-Memory Persistence, Tech Stack Laws, Deliverables Structure).
- Sections Added: Functional Scope (Phase I), Development Workflow, Governance.
- Templates Verified: plan-template.md, spec-template.md, tasks-template.md (Checked: generic placeholders compatible).
-->

# Evolution of Todo (Phase I) Constitution

## Core Principles

### I. Zero Manual Coding
I (the human) will NOT write code. You (the AI) must generate all implementation code based on my specs. I act as the Product Owner; you act as the Implementer.

### II. Spec-Driven Development
Development is strictly Spec-First. I will provide a Markdown specification (in a `/specs` folder context). You must read and "Plan" before you "Implement". No implementation code is written without an approved plan derived from a specification.

### III. Clean Architecture
Use modular code (e.g., separate `models.py`, `services.py`, `ui.py`, `main.py`) even for this simple console app. Separation of concerns is required to ensure maintainability and testability.

### IV. In-Memory Persistence
**Phase I Constraint**: All data must be stored in local memory (variables/dictionaries). No database or external file storage is allowed for this phase. The application state resets upon restart.

### V. Tech Stack Laws
- **Language**: Python 3.13+
- **Project Manager**: UV (`uv init`)
- **Testing**: Pytest (if needed)

### VI. Deliverables Structure
The project must strictly maintain the following folder structure:
- `CONSTITUTION.md` (This file)
- `/specs/` (Folder for feature specs, e.g., `01_basic_features.md`)
- `/src/` (Folder for Python source code)
- `README.md` (Setup instructions)
- `main.py` (Entry point)

## Functional Scope (Phase I)

The app must support exactly these 5 operations (Basic Level):
1.  **Add Task**: Create a new task with a Title (required) and Description (optional).
2.  **Delete Task**: Remove a task using its ID.
3.  **Update Task**: Modify the details of an existing task.
4.  **View Task List**: Display all tasks with their current status (e.g., [x] or [ ]).
5.  **Mark as Complete**: Toggle the completion status of a task.

## Development Workflow

1.  **Spec**: User provides a feature specification in `/specs`.
2.  **Plan**: AI acknowledges, analyzes, and proposes a plan (Architecture, Data Model, Tasks).
3.  **Implement**: AI generates code and tests based on the approved plan.
4.  **Verify**: AI runs tests and verifies functionality.

## Governance

**Constitution Supremacy**: This document supersedes all other practices.
**Amendments**: Changes to principles require a documented amendment process and version bump.
**Versioning**: Follows Semantic Versioning (MAJOR.MINOR.PATCH).
**Compliance**: All plans and implementations must be verified against these principles.

**Version**: 1.0.0 | **Ratified**: 2025-12-24 | **Last Amended**: 2025-12-24