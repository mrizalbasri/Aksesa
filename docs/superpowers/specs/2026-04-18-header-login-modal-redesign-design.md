# Header Login Modal Redesign (Clean Minimal)

## Context

Current header login modal works functionally, but visually feels dense and less polished. The target is a cleaner, lighter, more professional modal while preserving existing auth flow and backend integration.

## Scope

In scope:
- Redesign visual layout of header login modal in `frontend/components/Navbar.tsx`
- Improve spacing, typography hierarchy, input ergonomics, and action area clarity
- Keep existing auth logic (`/api/v1/auth/login`, sessionStorage token, auth sync event)

Out of scope:
- New `/login` page
- Auth architecture changes (cookies, refresh token, context refactor)
- Backend changes

## Goals

1. Reduce visual density and improve scanability.
2. Keep interaction simple and predictable.
3. Maintain accessibility basics (readable contrast, touch-friendly controls, visible states).

## Approaches Considered

### A) Quick polish only
- Minor spacing/radius/tone tweaks on existing structure.
- Pros: fastest.
- Cons: limited perceived quality gain; structure still feels cramped.

### B) Structural clean-minimal redesign (Selected)
- Recompose modal into clearer sections: header, field group, actions.
- Pros: biggest UX improvement with low implementation risk.
- Cons: moderate code updates in modal markup/classes.

### C) Redesign + animation system
- Add richer motion and icon-state choreography.
- Pros: premium feel.
- Cons: unnecessary complexity for current phase.

## Approved Design

## 1) Layout
- Keep centered modal with similar width, but increase internal breathing room.
- Header: compact top label + stronger title + short helper line.
- Form body: explicit field groups with consistent vertical rhythm.
- Action zone separated by subtle top divider to clarify completion step.

## 2) Visual Language
- Typography:
  - Title emphasis; body and labels remain neutral and readable.
  - Stable 16px input text, readable label contrast.
- Inputs:
  - Comfortable touch height, consistent padding, cleaner focus ring.
- Buttons:
  - Primary action visually dominant, secondary action subdued.
- Error state:
  - Softer container but still high-contrast text for clear diagnosis.

## 3) Interaction
- Submit remains async with stable loading state (no layout shift).
- Enter submits form.
- Backdrop click closes modal only when not submitting.
- Initial focus goes to email input when modal opens.

## Implementation Plan (for next step)

1. Update modal structure and class hierarchy in `Navbar.tsx`.
2. Add autofocus/focus management for first input on open.
3. Add backdrop close behavior guard (`!isLoggingIn`).
4. Keep auth flow and event sync unchanged.
5. Validate with type-check/build and manual UX pass.

## Risks and Mitigation

- Risk: visual mismatch with existing brand components.
  - Mitigation: keep existing token palette and shadcn primitives.
- Risk: modal behavior regression.
  - Mitigation: preserve existing submit/auth handlers; only reshape UI structure.

## Definition of Done

- Header modal feels visibly less dense and cleaner.
- Login flow works unchanged.
- Error/loading states remain clear and stable.
- Desktop and mobile navbar login interactions both remain functional.
