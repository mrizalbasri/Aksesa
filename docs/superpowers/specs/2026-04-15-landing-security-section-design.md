# Landing Security Section Design (Android-Responsive)

## Problem

Landing page sudah rapi, tetapi section keamanan belum optimal saat dibuka di Android (terutama viewport 360-412px). Dampaknya, pesan trust kurang cepat terbaca, konten terasa padat, dan CTA bisa kehilangan prioritas visual.

## Goal

Menyesuaikan section **Keamanan Data** agar:
- responsif untuk Android,
- rasa percaya user naik,
- pesan keamanan mudah dipahami pelaku UMKM,
- alur ke proses scoring tetap kuat.

## Design Direction

- **Scope**: tanpa page baru, hanya section baru di landing.
- **Platform focus**: Android mobile web (Chrome Android) sebagai baseline.
- **Tone**: bahasa sederhana untuk UMKM, minim istilah teknis.
- **Style**: light-first, konsisten dengan tema sekarang.
- **Accent**: orange untuk penekanan trust dan CTA.

## Android Responsive Rules

### Breakpoint dan Layout

1. **Android compact (<= 480px)**
   - Layout section 1 kolom.
   - 3 kartu keamanan ditumpuk vertikal.
   - Padding section: 16px horizontal, 28-32px vertical.
   - CTA full-width.
2. **Large phone / small tablet (481-768px)**
   - Heading tetap 1 lane.
   - Grid kartu adaptif menjadi 2 kolom saat ruang cukup.
3. **Desktop (> 768px)**
   - Grid kembali ke 3 kolom.
   - CTA auto-width.

### Touch dan Keterbacaan Android

- Tinggi minimum elemen interaktif: **48px**.
- Jarak antar elemen interaktif minimal 8px.
- Ukuran body text minimum di Android compact: **15px**.
- Line-height body text: 1.5-1.6.
- Feedback interaksi tidak boleh bergantung pada hover saja.

## Information Architecture

Section baru ditempatkan:
1. setelah section fitur utama,
2. sebelum FAQ/footer.

Struktur section:
1. Heading + subheading singkat.
2. Grid adaptif 3 kartu keamanan.
3. CTA ke `/scoring`.

## Content Design

### Heading

- Label kecil: `Keamanan Data`
- Judul: `Data bisnis Anda kami jaga dengan standar yang jelas`
- Deskripsi: 1 kalimat ringkas, langsung ke manfaat user.

### 3 Kartu Utama (Bahasa Simpel)

1. **Data terenkripsi**
   - “Data dilindungi saat dikirim dan saat disimpan.”
2. **Akses terbatas**
   - “Data hanya dipakai untuk analisis skor kredit Anda.”
3. **Kontrol penghapusan**
   - “Anda bisa meminta penghapusan data sesuai kebutuhan.”

## Visual Design

- Background section: cream tipis (`#fffdf9`) agar beda dari blok sebelumnya.
- Card: putih dengan border oat (`#dedbd6`), radius 12px.
- Icon: outline kecil, warna orange (`#ff5600`).
- Judul kartu: off-black (`#111111`), body text (`#4f4f4b`) untuk kontras lebih baik di mobile.
- State interaksi:
  - default: border netral,
  - active/pressed: border mendekati orange + shadow tipis,
  - hover tetap untuk desktop, tetapi bukan indikator utama.

## Interaction

- Tambah anchor id di section keamanan agar bisa ditautkan dari nav: `keamanan-data`.
- CTA section:
  - teks: `Mulai Scoring Aman`
  - target: `/scoring`
  - full-width pada Android compact, auto-width pada desktop.
- Tidak ada interaksi kompleks; fokus pada keterbacaan dan trust.

## Implementation Surface

- `frontend/components/landing/LandingPage.tsx`
  - tambah section baru + konten kartu + CTA.
  - terapkan layout mobile-first (`1 col -> 2 col -> 3 col`).
  - set CTA full-width di viewport Android compact.
- `frontend/components/Navbar.tsx`
  - tambah tautan anchor `Keamanan Data` ke `#keamanan-data`.
- `frontend/components/landing/Footer.tsx` (opsional ringan)
  - tambah tautan internal ke anchor keamanan bila perlu.

## Error Handling

Karena ini section statis, tidak ada error runtime khusus. Pastikan:
- link anchor valid,
- CTA mengarah ke route yang aktif,
- tidak ada clipping teks pada viewport Android 360px.

## Testing Strategy

- Uji viewport Android umum: **360x800**, **390x844**, **412x915**.
- Uji portrait dan landscape.
- Cek konsistensi spacing untuk mode 1 kolom, 2 kolom, dan 3 kolom.
- Cek link anchor `#keamanan-data`.
- Cek CTA ke `/scoring`.
- Cek touch target minimum 48px pada CTA.

## Out of Scope

- Pembuatan page baru `/keamanan-data`.
- Penambahan compliance framework detail (ISO/SOC/GDPR).
- Perubahan alur backend atau penyimpanan data.
