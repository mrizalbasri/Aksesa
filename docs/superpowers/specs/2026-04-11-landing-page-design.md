# Landing Page Phase 2 Frontend Design

**Tanggal**: 2026-04-11  
**Topik**: Refactor landing page menggunakan shadcn/ui  
**Status**: Approved for implementation

## 1. Problem Statement

Landing page sudah tersedia tetapi belum konsisten dengan komponen shadcn/ui, masih campuran gaya lama, dan belum sepenuhnya mengikuti target Phase 2 frontend dengan struktur yang jelas (Hero, 4 feature cards, CTA, Footer) dalam Bahasa Indonesia.

## 2. Goals and Scope

### In Scope

1. Refactor landing page yang ada tanpa rebuild total.
2. Gunakan komponen dan pola style shadcn/ui + Tailwind.
3. Pertahankan struktur modular komponen:
   - `LandingHero`
   - `FeatureCard`
   - `LandingPage`
   - `Footer`
4. Konten berbahasa Indonesia.
5. CTA utama mengarah ke `/scoring`.
6. Layout responsive mobile-first.

### Out of Scope

1. Integrasi API/backend.
2. Form interaktif scoring.
3. Dashboard hasil dan loan simulator.
4. Penambahan dependency frontend baru.

## 3. Approaches Considered

### A. Refactor Existing Components (**Selected**)

Refactor komponen landing yang sudah ada ke style shadcn/ui.

**Kelebihan**:
- Paling cepat untuk eksekusi phase.
- Risiko regresi rendah.
- Struktur file tetap familiar.

**Kekurangan**:
- Masih membawa sebagian struktur lama.

### B. Full Rebuild from Scratch

Bangun landing page baru dari nol.

**Kelebihan**:
- Arsitektur bersih dari awal.

**Kekurangan**:
- Waktu lebih lama.
- Risiko ketidaksesuaian terhadap komponen existing lebih tinggi.

### C. Hybrid Bertahap

Refactor section per section dalam beberapa iterasi.

**Kelebihan**:
- Risiko teknis rendah per langkah.

**Kekurangan**:
- Potensi UI tidak konsisten sementara waktu.

## 4. Architecture and Component Design

### Page Composition

`pages/index.tsx` tetap menjadi entry point dan merender `LandingPage`.

`LandingPage` mengatur urutan section:
1. Hero section
2. Feature section (`id="fitur"`)
3. Footer

### Components

1. `LandingHero`
   - Judul nilai produk.
   - Deskripsi singkat.
   - 2 CTA:
     - Primer: ke `/scoring`
     - Sekunder: ke `#fitur`
   - Tombol menggunakan `Button` dari shadcn/ui.

2. `FeatureCard`
   - Reusable card untuk 4 fitur utama:
     - Input Data Alternatif
     - AI Scoring Engine
     - Dashboard Interaktif
     - Simulasi Pinjaman
   - Ikon menggunakan `lucide-react`.

3. `Footer`
   - Branding ringkas.
   - Copyright.
   - Link internal sederhana.

## 5. UX and Interaction Flow

1. User membuka landing page.
2. User membaca nilai utama produk dari hero.
3. User dapat:
   - langsung klik CTA primer ke `/scoring`, atau
   - melihat detail fitur melalui CTA sekunder/scroll.
4. User melihat 4 capability utama sebelum lanjut ke alur scoring.

## 6. Error Handling and Reliability

Karena halaman bersifat statis, handling difokuskan ke:
1. Link internal valid (`/scoring`, anchor `#fitur`).
2. Komponen tetap render aman tanpa data eksternal.
3. Hindari fallback silent yang menutupi error routing.

## 7. Testing Strategy

1. Jalankan `npm run lint` pada frontend.
2. Jalankan `npm run type-check` pada frontend.
3. Cek render landing pada viewport mobile dan desktop.
4. Cek CTA utama menuju `/scoring`.

## 8. Acceptance Criteria

1. Landing page menampilkan Hero + 4 Feature Cards + CTA + Footer.
2. Bahasa konten Indonesia.
3. CTA primer berfungsi ke `/scoring`.
4. Styling konsisten dengan pola shadcn/ui dan Tailwind project.
5. Tidak menambah dependency baru.
