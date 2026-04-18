# Kapabilitas Sistem Card Polish (Minimal-Depth)

## Context

Section **Kapabilitas Sistem** sudah informatif, tetapi visual card terasa kurang menarik. Target perubahan: menaikkan kualitas visual card agar lebih hidup, tetap sederhana, dan tidak menambah kepadatan konten.

## Scope

In scope:
- Poles visual card fitur pada section `#fitur` di landing page.
- Perbaikan terbatas pada presentasi card: spacing, border, depth, hover/focus interaction.
- Menjaga konten card tetap sama (tanpa menambah copy baru).

Out of scope:
- Perubahan layout besar section.
- Penambahan animasi scroll.
- Perubahan hero, FAQ, atau section lain.

## Approaches Considered

### A) Minimal-depth (Selected)
- Border lebih rapi, elevasi halus, dan hover lift kecil.
- Pros: card terasa modern tanpa terlihat ramai.
- Cons: perubahan subtle, bukan transformasi visual besar.

### B) Flat-clean
- Hanya rapikan spacing/typography tanpa elevasi.
- Pros: sangat aman dan minimal.
- Cons: peningkatan visual terasa lebih kecil.

### C) Structured-minimal
- Tambah struktur internal card (header/body separation).
- Pros: hierarki informasi lebih kuat.
- Cons: berpotensi menambah noise visual.

## Approved Design

### 1) Visual Structure
- Card tetap berlatar putih dengan border netral.
- Area ikon dibuat lebih tegas sebagai anchor visual.
- Title dipertahankan tegas, deskripsi tetap ringkas.
- Radius dan spacing dibuat konsisten agar grid terlihat lebih rapi.

### 2) Interaction
- Hover/focus memberi lift tipis (`translateY` kecil) dan shadow lembut.
- Border accent naik tipis saat interaksi.
- Durasi transisi singkat (~180–220ms) agar responsif.

### 3) Accessibility
- Untuk pengguna `prefers-reduced-motion`, gerak dinonaktifkan.
- State fokus keyboard tetap jelas.

## Error Handling and Safety

- Tidak mengubah alur data atau API.
- Perubahan hanya pada presentasi UI card, sehingga risiko regresi fungsional rendah.

## Validation

- Type-check frontend harus lolos.
- Build frontend harus sukses.
- Interaksi hover/focus tetap nyaman pada desktop dan tidak mengganggu mobile.

## Definition of Done

- Card di section Kapabilitas Sistem terlihat lebih menarik namun tetap minimal.
- Interaksi halus terasa konsisten dengan gaya landing saat ini.
- Tidak ada perubahan konten atau struktur informasi inti.
