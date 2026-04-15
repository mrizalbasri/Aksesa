# Project Guidelines

## Code Style

- Follow existing folder boundaries and naming:
  - Frontend page routes in `frontend/pages/`.
  - Frontend feature components in `frontend/components/landing/` and `frontend/components/scoring/`.
  - Shared UI primitives in `frontend/components/ui/`.
  - Shared frontend utilities in `frontend/lib/`.
  - Backend API entry and routes in `backend/`.
- Frontend is TypeScript strict mode. Avoid `any` and keep types explicit.
- Use the existing `@/*` import alias in frontend code.
- Keep form validation in Zod schemas (`frontend/lib/validators.ts`) and use `react-hook-form` in scoring flows.
- Use Tailwind utility classes and existing UI primitives instead of introducing a new styling system.

## Architecture

- This repository is split into three layers:
  - Frontend: Next.js app in `frontend/` for landing, scoring flow, and result pages.
  - Backend: FastAPI service in `backend/` with placeholder endpoints for scoring, OCR, and simulation.
  - ML: training assets and scripts in `ml/`.
- Current backend integration modules are planned in `backend/services/` (`azure_openai.py`, `azure_ml.py`, `azure_docintel.py`) and are not fully implemented yet.
- Prefer small, feature-scoped changes that keep these boundaries intact.

## Build and Test

- Use these commands from repo root:
  - Frontend dev: `cd frontend && npm run dev`
  - Frontend build: `cd frontend && npm run build`
  - Frontend lint: `cd frontend && npm run lint`
  - Frontend type-check: `cd frontend && npm run type-check`
  - Backend dev: `cd backend && python -m uvicorn main:app --reload`
  - Backend deps: `cd backend && pip install -r requirements.txt`
  - ML deps: `cd ml && pip install -r requirements.txt`
- Run relevant checks after edits:
  - Frontend changes: at minimum `npm run type-check` and `npm run lint` in `frontend/`.
  - Backend changes: start FastAPI app to confirm import/runtime sanity.

## Conventions and Pitfalls

- Environment setup is required before meaningful backend work:
  - Copy `backend/.env.example` to `backend/.env` and configure Azure variables.
- Backend CORS is driven by `ALLOWED_ORIGINS` (comma-separated string in current implementation).
- Keep API behavior aligned with current placeholder endpoints until service modules are implemented.
- For scoring forms:
  - Invoice upload currently expects `image/jpeg` or `image/png` and max 5 MB.
  - Transaction and business profile fields use numeric coercion in Zod.
- Do not duplicate long project context in code comments or prompts. Link to docs instead.

## Documentation Links

- Product and architecture overview: `README.md`
- Setup instructions: `SETUP.md`
- Delivery plan: `DEVELOPMENT_PLAN.md`
- Current phase details: `PHASE_2_PLAN.md`
- Backend service implementation targets: `backend/services/README.md`
- Existing design spec example: `docs/superpowers/specs/2026-04-11-landing-page-design.md`

## Working Agreement for Agents

- Make the smallest practical change to satisfy the request.
- Preserve existing patterns before introducing new abstractions.
- If a requirement conflicts with current scaffolding status, state the constraint clearly and proceed with a safe incremental step.
