# Implementation Plan: Todo App Baseline

**Branch**: `001-todo-baseline` | **Date**: 2025-12-25 | **Spec**: `specs/001-todo-baseline/spec.md`
**Input**: Feature specification from `/specs/001-todo-baseline/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

The goal is to implement a baseline full-stack Todo application. The approach involves:
1.  **Backend**: FastAPI + SQLModel (PostgreSQL) for task persistence and management.
2.  **Auth**: JWT-based authentication using Better Auth patterns (Frontend) and middleware verification (Backend).
3.  **Frontend**: Next.js App Router UI with Tailwind/shadcn for managing tasks.
4.  **Security**: Strict data isolation by user ID at the database query level.

## Technical Context

**Language/Version**: Python 3.11+, TypeScript 5+
**Primary Dependencies**: FastAPI, SQLModel, Next.js 16+, Tailwind CSS, shadcn/ui, Better Auth
**Storage**: Neon Serverless PostgreSQL
**Testing**: pytest (Backend), Jest/Vitest (Frontend)
**Target Platform**: Web (Vercel/Render compatible)
**Project Type**: web
**Performance Goals**: < 200ms API response for CRUD
**Constraints**: Monorepo strict structure, End-to-end type safety (where possible)
**Scale/Scope**: MVP for multi-user support

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

-   [x] **Spec-First**: `spec.md` approved.
-   [x] **Gemini-Only**: Agent is executing changes.
-   [x] **Separation of Concerns**: Plan defines distinct Frontend/Backend.
-   [x] **Security**: JWT auth + Row-level (application) isolation planned.
-   [x] **Monorepo**: Structure defined below.

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-baseline/
├── plan.md              # This file
├── research.md          # Technology decisions
├── data-model.md        # Database schema
├── quickstart.md        # Run instructions
├── contracts/           # OpenAPI specs
│   └── openapi.yaml
└── tasks.md             # To be created
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/
│   │   ├── routes/
│   │   └── deps.py
│   ├── core/
│   │   ├── config.py
│   │   └── security.py
│   ├── models/
│   │   ├── user.py
│   │   └── task.py
│   └── main.py
└── tests/

frontend/
├── src/
│   ├── app/
│   │   ├── login/
│   │   └── dashboard/
│   ├── components/
│   │   └── ui/
│   └── lib/
│       ├── api.ts
│       └── auth.ts
└── tests/
```

**Structure Decision**: Standard "Web application" split (Frontend/Backend) as per Constitution Principle V.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Monorepo | Mandated by User | Simple folder split would lose shared tooling benefits later |