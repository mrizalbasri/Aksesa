# Landing Section Color Polish (Non-Hero)

## Context

Landing page sudah rapi, tetapi beberapa section selain hero terasa terlalu datar. Target perubahan adalah membuat halaman lebih hidup dengan aksen warna yang halus, tanpa menambah keramaian visual.

## Scope

In scope:
- Poles visual pada section non-hero:
  - Kapabilitas Sistem (`#fitur`)
  - Keamanan Data (`#keamanan-data`)
  - FAQ
  - Footer
- Penambahan background tint tipis dan aksen dekoratif ringan per section.
- Tetap mempertahankan struktur, copy, dan komponen utama yang ada.

Out of scope:
- Perubahan layout besar.
- Penambahan icon baru.
- Scroll animation lintas section.
- Perubahan alur data, API, atau logic bisnis.

## Approaches Considered

### A) Soft tint layering (Selected)
- Memberikan tone warna sangat tipis di tiap section + glow/decor halus.
- Pros: lebih hidup, tetap minimal, aman terhadap arah visual saat ini.
- Cons: efek subtil; perubahan terasa elegan, bukan dramatis.

### B) Section banding
- Kontras antar section dibuat lebih jelas lewat blok warna bergantian.
- Pros: pemisahan section kuat.
- Cons: berpotensi terlihat terlalu kontras untuk style minimal saat ini.

### C) Border-first
- Fokus pada garis dan surface tanpa tambahan tint berarti.
- Pros: sangat aman.
- Cons: peningkatan rasa “hidup” terbatas.

## Approved Design

### 1) Visual Direction
- Tetap netral dengan aksen tipis.
- Tidak menambah icon baru.
- Nuansa warm/clean dipertahankan.

### 2) Section Treatment
- **Kapabilitas Sistem:** tambah tint latar sangat tipis + aksen blur lembut agar area card tidak datar.
- **Keamanan Data:** tone latar berbeda tipis dari Kapabilitas untuk pemisahan visual yang tetap halus.
- **FAQ:** tint netral hangat tipis agar area tanya-jawab terasa lebih “berisi”.
- **Footer:** penyesuaian tonal ringan agar penutupan halaman terasa lebih refined.

### 3) Interaction and Accessibility
- Tidak menambah animasi scroll.
- Hover/focus yang sudah ada tetap dipertahankan.
- Kontras teks tetap dijaga agar keterbacaan aman.

## Technical Plan

- Perubahan utama di:
  - `frontend/components/landing/LandingPage.tsx`
  - (bila perlu) `frontend/components/landing/Footer.tsx`
- Fokus pada class Tailwind (warna/background/dekor), tanpa ubah state/logic data.

## Risks and Mitigation

- Risk: tampilan jadi terlalu ramai.
  - Mitigation: batasi saturasi warna dan opacity aksen pada level tipis.
- Risk: konsistensi visual antar section menurun.
  - Mitigation: gunakan keluarga warna yang sama dan treatment seragam.

## Validation

- Frontend type-check harus lolos.
- Frontend build harus sukses.
- Section non-hero terlihat lebih hidup namun tetap minimal.

## Definition of Done

- Semua section non-hero memiliki perbedaan tonal halus yang konsisten.
- Halaman terasa lebih hidup tanpa menambah keramaian.
- Tidak ada perubahan logic atau konten utama.
