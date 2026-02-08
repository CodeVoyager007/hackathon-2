---
id: 002
title: update-constitution-for-phase-3-cui
stage: constitution
date: 2025-12-29
surface: agent
model: Gemini
feature: none
branch: master
user: Dell
command: /sp.constitution
labels: ["governance", "phase-3", "cui"]
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

/sp.constitution You are e acting as a senior AI systems engineer executing Phase-3 of a Spec-Driven Development workflow using Spec-Kit Plus.

PHASE-3 OBJECTIVE
extenend the existing Phase-2 Todo Full-Stack Web Application into an AI-powered Conversational User Interface (CUI).

This phase introduces:
- Natural language task management
- AI agents powered by OpenAI Agents SDK but using gemini api key and base url "https://generativelanguage.googleapis.com/v1beta/openai/
- An MCP (Model Context Protocol) server exposing task operations as tools

The existing Phase-2 frontend, backend, authentication, and database code is preserved and reused.


CORE PRINCIPLES


- Spec-first development is mandatory
- No manual coding; GEMINI CLI  performs all changes
- Phase-2 functionality must remain intact
- Conversational interface replaces GUI task interactions
- All AI behavior must be tool-driven via MCP


ARCHITECTURAL CONSTRAINTS


Frontend:
- Next.js (App Router)
- Tailwind CSS
- shadcn/ui
- OpenAI ChatKit UI

Backend:
- FastAPI
- SQLModel
- Neon PostgreSQL
- OpenAI Agents SDK
- Official MCP SDK


KEY DESIGN RULE


The server must be stateless.
All conversation and task state must be persisted in the database.

## Response snapshot

Updated constitution to v1.2.0, defining Phase-3 CUI requirements, new AI principles, and tech stack updates while preserving legacy functionality.

## Outcome

- ✅ Impact: Defined Phase-3 CUI requirements
- 🧪 Tests: N/A
- 📁 Files: Updated constitution.md
- 🔁 Next prompts: /sp.plan
- 🧠 Reflection: Constitution updated to reflect new AI/CUI direction.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): default
- Next experiment (smallest change to try): None
