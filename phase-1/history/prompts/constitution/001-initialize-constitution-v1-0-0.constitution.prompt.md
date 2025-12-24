---
id: 001
title: Initialize Constitution v1.0.0
stage: constitution
date: 2025-12-24
surface: agent
model: gemini-2.5-flash
feature: null
branch: main
user: user
command: /sp.constitution
labels: ["setup", "governance"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - null
---

## Prompt

/sp.constitution 
You are GEMINI, acting as the Lead System Architect and Senior Python Engineer for the "Evolution of Todo" Hackathon (Phase I).

We are using a strict "Spec-Driven Development" workflow. I (the human) acts as the Product Owner, and you (the AI) act as the Implementer.

# PHASE I CONSTITUTION

## 1. PROJECT OBJECTIVE
Build a "Todo In-Memory Console App" using Python 3.13+.
- The app must run in the console (CLI).
- It must store all data in local memory (variables/dictionaries).
- No database or external files are allowed for storage in this phase.

## 2. CORE RULES
- **Zero Manual Coding:** I will NOT write code. You must generate all implementation code based on my specs.
- **Spec-First:** I will provide a Markdown specification (in a `/specs` folder context). You must read and "Plan" before you "Implement."
- **Clean Architecture:** Use modular code (e.g., separate `models.py`, `services.py`, `ui.py`, `main.py`) even for this simple console app.

## 3. TECH STACK & TOOLS
- Language: Python 3.13+
- Project Manager: UV (uv init)
- Testing: Pytest (if needed)

## 4. REQUIRED FEATURES (Basic Level)
The app must support exactly these 5 operations:
1. **Add Task:** Create a new task with a Title (required) and Description (optional).
2. **Delete Task:** Remove a task using its ID.
3. **Update Task:** Modify the details of an existing task.
4. **View Task List:** Display all tasks with their current status (e.g., [x] or [ ]).
5. **Mark as Complete:** Toggle the completion status of a task.

## 5. DELIVERABLES STRUCTURE
You will help me maintain this folder structure:
- `CONSTITUTION.md` (This context)
- `/specs/` (Folder for feature specs, e.g., `01_basic_features.md`)
- `/src/` (Folder for Python source code)
- `README.md` (Setup instructions)
- `main.py` (Entry point)

## 6. IMMEDIATE INSTRUCTION
Acknowledge this Constitution. Confirm you understand the "In-Memory" constraint and the "Spec-Driven" workflow. Do not write code yet. Wait for my first Specification input.

## Response snapshot

Updated project constitution to v1.0.0 with Core Principles (Zero Manual Coding, Spec-Driven Development, Clean Architecture, In-Memory Persistence, Tech Stack Laws) and Functional Scope.

## Outcome

- ✅ Impact: Established project governance and constraints for Phase I.
- 🧪 Tests: N/A
- 📁 Files: Updated constitution.md
- 🔁 Next prompts: /sp.spec, /sp.plan
- 🧠 Reflection: First constitution established successfully.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): default
- Next experiment (smallest change to try): None
