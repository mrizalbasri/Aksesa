# Landing Hero Density Redesign (Clean + Informative)

## Context

Landing hero currently feels visually clean but too empty in several regions. The goal is to make the hero feel more substantial and convincing without losing the existing minimalist style.

## Scope

In scope:
- Improve information density in `frontend/components/landing/LandingHero.tsx`
- Keep existing structure and routing behavior (`/scoring`, `#fitur`)
- Strengthen perceived value through clearer content hierarchy and trust-focused metrics

Out of scope:
- New sections outside hero
- Backend or scoring logic changes
- Global design token overhaul

## Goals

1. Reduce empty feeling across left and right hero areas.
2. Keep visual style clean, readable, and brand-consistent.
3. Improve first-screen clarity: what Aksesa does, why trust it, what users should do next.

## User-Approved Direction

Chosen direction: **content-dense hero redesign**.

Key choices approved:
- Hero remains 2-column layout.
- Add summary strip with 3 meaningful metrics under core message.
- Upgrade trust panel on the right to feel more informative and alive.
- Maintain concise copy and mobile readability.

## Approaches Considered

### A) Visual-only polish
- Pros: fastest update.
- Cons: likely still feels empty because content volume stays low.

### B) Content-dense hero redesign (Selected)
- Pros: strongest impact on perceived completeness and trust, with moderate implementation effort.
- Cons: requires careful spacing control to avoid clutter.

### C) Split hero into two major sections
- Pros: can hold more content.
- Cons: heavier structural change and increased above-the-fold complexity.

## Approved Design

## 1) Layout Structure
- Keep current 2-column grid.
- Left column layers:
  1. Engine badge
  2. Headline + subheadline
  3. Supporting paragraph
  4. CTA row
  5. Summary metrics strip (3 items)
  6. Value tags row
- Right column remains trust panel, but with clearer blocks and stronger hierarchy.

## 2) Content Density Additions
- Add **summary strip** (3 compact metrics), for example:
  - Rata-rata waktu analisis
  - Tingkat validasi OCR
  - Cakupan data alternatif
- Transform passive tags into purposeful value signals.
- Right panel shows trust evidence with clearer labels, spacing, and progress framing.

## 3) Visual System
- Keep current palette and component style.
- Increase hierarchy contrast using:
  - better heading/subheading separation,
  - refined card depth,
  - controlled vertical spacing compression.
- Prevent clutter by preserving generous internal padding and limiting line lengths.

## 4) Responsive Behavior
- On mobile:
  - summary metrics stack cleanly (1 or 2 columns depending on width),
  - CTA remains prominent and easy to tap,
  - trust panel follows content without excessive height.
- No horizontal scroll; all badges/tags wrap naturally.

## 5) UX & Accessibility Constraints
- Maintain clear text contrast and legible body size.
- Keep CTA hierarchy explicit (primary vs secondary).
- Ensure informational chips remain readable and not decorative-only.

## Implementation Plan (Next Step)

1. Refactor hero left-column structure to include metrics strip.
2. Improve right trust panel content grouping and spacing.
3. Rebalance margins/paddings so visual density increases without crowding.
4. Validate mobile wrapping and hierarchy.

## Risks and Mitigation

- Risk: dense content looks busy.
  - Mitigation: cap metric count to 3 and enforce concise labels.
- Risk: hero becomes too tall on mobile.
  - Mitigation: compact spacing scale and stack order optimization.

## Definition of Done

- Hero no longer feels empty in major visual zones.
- First-screen message, trust, and CTA are all clear at a glance.
- Layout remains clean and readable across mobile and desktop.
