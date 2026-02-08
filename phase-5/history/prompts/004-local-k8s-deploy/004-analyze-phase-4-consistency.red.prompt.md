---
id: 004
title: Analyze Phase 4 Consistency
stage: red
date: 2026-01-01
surface: agent
model: gemini-2.0-flash-exp
feature: 004-local-k8s-deploy
branch: 004-local-k8s-deploy
user: user
command: /sp.analyze
labels: [analysis, consistency, phase-4, infrastructure]
links:
  spec: specs/004-local-k8s-deploy/spec.md
  ticket: null
  adr: null
  pr: null
files:
 - specs/004-local-k8s-deploy/spec.md
 - specs/004-local-k8s-deploy/plan.md
 - specs/004-local-k8s-deploy/tasks.md
tests:
 - null
---

## Prompt

Perform a non-destructive cross-artifact consistency and quality analysis across spec.md, plan.md, and tasks.md after task generation.

## Response snapshot

Analyzed Phase 4 artifacts. Found consistent coverage of all functional requirements and user stories in tasks. Constitution principles (IaC, AIOps, Local-First) are fully respected. No critical issues or ambiguities detected. All 6 functional requirements and 4 user stories are mapped to actionable tasks.

## Outcome

- ✅ Impact: Validated consistency of Phase 4 specs and plan.
- 🧪 Tests: N/A
- 📁 Files: N/A
- 🔁 Next prompts: /sp.implement
- 🧠 Reflection: Infrastructure projects often have tighter coupling between Spec/Plan/Tasks than code features because the "feature" IS the infrastructure.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): default
- Next experiment (smallest change to try): None
