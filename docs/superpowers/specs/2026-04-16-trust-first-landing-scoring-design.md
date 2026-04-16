# Trust-First Landing & Scoring Flow Design

## Problem

Landing dan flow scoring sudah berjalan, tetapi trust signal belum cukup kuat untuk mendorong user lanjut sampai result dan melakukan aksi bernilai (simpan/unduh/bagikan).

## Goal

1. Menaikkan rasa percaya user tanpa menambah friksi awal.
2. Menjaga alur tetap sederhana: landing -> scoring -> result.
3. Menerapkan login hanya pada aksi bernilai, bukan saat mulai.

## Final Decisions

1. Tetap 3 halaman: `landing -> scoring -> result`.
2. Prioritas desain: **Trust-First**.
3. Tambah 1 aksen warna baru: hijau trust (`#2C6415`).
4. Login **tidak wajib** di awal; diminta saat user ingin simpan/unduh/bagikan.

## Design Direction

- Gaya visual tetap konsisten dengan tema saat ini (cream, orange, neutral).
- Orange dipakai untuk aksi/penekanan.
- Hijau trust dipakai untuk sinyal aman/verified/sukses.
- Copy tetap sederhana, langsung, dan mudah dipahami pengguna UMKM.

## Information Architecture

### Page Structure

1. Landing: value proposition + security trust block + FAQ.
2. Scoring: form bertahap dengan trust hints yang konsisten.
3. Result: ringkasan skor + aksi bernilai dengan login gate.

### Auth Strategy

- Guest dapat menyelesaikan flow sampai result.
- Prompt login hanya muncul saat aksi bernilai dipicu.

## Component-Level Design

### 1) Landing (`frontend/components/landing/LandingPage.tsx`)

- Pertahankan section keamanan yang sudah ditambahkan.
- Tampilkan blok “Bukti Keamanan” ringkas dengan 3 poin inti:
  - Data terenkripsi
  - Akses terbatas
  - Kontrol penghapusan
- Gunakan ikon konsisten, microcopy singkat, dan hierarki visual yang jelas.

### 2) Scoring (`frontend/pages/scoring.tsx` + komponen terkait)

- Tambahkan trust strip ringan di area header form, contoh:
  - “Data dipakai hanya untuk analisis skor.”
- Pastikan trust strip tidak mengganggu fokus input.
- Terapkan aksen hijau hanya untuk sinyal aman/sukses.

### 3) Result (`frontend/pages/result.tsx`)

- Definisikan dua state visual:
  1. Guest: lihat hasil, aksi bernilai terkunci dengan prompt login.
  2. Logged-in: aksi bernilai aktif.
- Tambahkan badge trust/safe status setelah user login atau setelah aksi simpan berhasil.

## Interaction & Data Flow

1. User masuk landing tanpa login.
2. User lanjut ke scoring dan submit data tanpa login.
3. User melihat result sebagai guest.
4. Saat user klik `Simpan Hasil`, `Download PDF`, atau `Bagikan`:
   - tampilkan prompt login,
   - jika login sukses, lanjutkan aksi yang tadi dipilih,
   - jika login dibatalkan, user tetap melihat result guest.

## Error Handling

- Jika login gagal: tampilkan pesan jelas + aksi ulang (retry).
- Jika unduh/bagikan gagal: jangan hilangkan result; tampilkan notifikasi error yang dapat ditindaklanjuti.
- Hindari silent failure pada aksi bernilai.

## Testing Strategy

1. Guest dapat mencapai result tanpa login.
2. Guest klik Download -> login prompt -> login sukses -> download lanjut.
3. Guest membatalkan login -> tetap bisa lihat result.
4. Logged-in dapat simpan/unduh/bagikan normal.
5. Kontras warna (termasuk aksen hijau) tetap terbaca di mobile dan desktop.

## Out of Scope

- Mewajibkan login sebelum halaman scoring.
- Menambah halaman baru di luar landing/scoring/result.
- Merombak besar arsitektur backend auth pada tahap ini.

## Implementation Surface

- `frontend/components/landing/LandingPage.tsx`
- `frontend/pages/scoring.tsx`
- `frontend/pages/result.tsx`
- Komponen pendukung scoring/result untuk state dan prompt login
