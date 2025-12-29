---
id: 001
title: Update Constitution v1.1.0
stage: constitution
date: 2025-12-25
surface: agent
model: gemini-2.0-flash
feature: none
branch: main
user: user
command: /sp.constitution
labels: ["governance", "setup", "rules"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - none
---

## Prompt

/sp.constitution You are Gemini acting as a senior full-stack engineer executing strict Spec-Driven Development using Spec-Kit Plus format.

PROJECT OBJECTIVE

Build a Todo Full-Stack Web Application from scratch as a modern, multi-user system with persistent storage and authentication.

The application must:
- Be implemented entirely through specs, plans, tasks, and agentic execution
- Support multiple authenticated users
- Persist data in a PostgreSQL database (Neon)
- Provide a secure REST API
- Deliver a responsive web-based user interface

No legacy system exists. This project starts from zero.

CORE PRINCIPLES

- Spec-first development is mandatory
- No implementation before specification approval
- Gemini is the only entity allowed to write code
- Frontend and backend responsibilities remain strictly separated
- Authentication and authorization enforced on every request

ARCHITECTURAL CONSTRAINTS

- Monorepo structure using Spec-Kit Plus
- Frontend: Next.js 16+ (App Router), TypeScript, Tailwind CSS, shadcn/ui
- Backend: FastAPI (Python), SQLModel ORM
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth with JWT
- Package Managers:
  - Frontend: npm
  - Backend: uv

FINAL OUTCOME

A fully functional full-stack multiplle pages,Todo web application demonstrating:
- Proper spec-driven engineering
- Secure multi-user task isolation
- Clean monorepo organization
- End-to-end authenticated workflows

## Response snapshot

Updated constitution to v1.1.0 with project-specific principles (Spec-First, Gemini-Only, Separation of Concerns, Security, Monorepo) and tech stack laws.

## Outcome

- ✅ Impact: Constitution updated to reflect specific project requirements and tech stack.
- 🧪 Tests: None
- 📁 Files: .specify/memory/constitution.md
- 🔁 Next prompts: /sp.specify
- 🧠 Reflection: Established clear project governance and tech constraints.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
