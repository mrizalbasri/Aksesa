# Micro-interaction Upgrade with React Spring

## Context

UI sudah rapi, tetapi terasa statis. Target perubahan adalah menambah gerak halus yang membuat pengalaman lebih hidup tanpa terlihat ramai.

## Scope

In scope:
- Tambah 1 library animasi: `@react-spring/web`
- Terapkan micro-interaction pada:
  - CTA utama hero (`LandingHero.tsx`)
  - Trust card kanan hero (`LandingHero.tsx`)
  - Modal login header (`Navbar.tsx`)

Out of scope:
- Scroll animation lintas section
- Refactor layout besar
- Animasi dekoratif kompleks

## Approaches Considered

### A) React Spring (Selected)
- Pros: gerakan natural, ideal untuk micro-interaction, API React-friendly.
- Cons: menambah dependency baru.

### B) Motion One
- Pros: lebih ringan.
- Cons: lebih low-level, butuh wiring lebih banyak untuk pola React.

### C) GSAP
- Pros: sangat kuat untuk animasi kompleks.
- Cons: overkill untuk kebutuhan micro-interaction sederhana.

## Approved Design

## 1) Scope Section
- Hero CTA: hover/press spring ringan.
- Hero trust card: entrance halus + hover lift tipis.
- Login modal header: fade + scale in/out yang halus.

## 2) Behavior Section
- Animasi cepat dan responsif (tidak menghambat interaksi).
- Tidak menyebabkan layout shift.
- Hormati `prefers-reduced-motion` untuk aksesibilitas.

## Implementation Plan

1. Install `@react-spring/web` di `frontend`.
2. Tambahkan wrapper `animated` pada elemen target.
3. Gunakan spring preset ringan untuk hover/enter/exit.
4. Tambahkan guard reduced-motion.
5. Validasi build dan type-check.

## Risks and Mitigation

- Risk: animasi terasa berlebihan.
  - Mitigation: limit hanya pada 3 area inti dengan amplitude kecil.
- Risk: inkonsistensi feel antar komponen.
  - Mitigation: gunakan token durasi/physics yang konsisten.

## Definition of Done

- UI terasa lebih hidup pada hero CTA, hero card, dan login modal.
- Tidak mengganggu performa atau keterbacaan.
- Pengguna dengan reduced-motion tidak dipaksa melihat animasi penuh.
