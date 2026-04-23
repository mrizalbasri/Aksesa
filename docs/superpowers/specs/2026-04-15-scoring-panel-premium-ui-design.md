# Scoring Panel Premium UI Design

## Problem

UI pada halaman **Akses Panel / Scoring** terasa kurang rapi, kurang informatif, dan belum memberi rasa progres yang jelas saat user mengisi data bertahap.

## Goal

Meningkatkan pengalaman pengisian scoring agar:
- lebih jelas alurnya,
- lebih profesional secara visual,
- lebih nyaman dibaca,
- dan lebih meyakinkan untuk konteks penilaian kredit UMKM.

## Design Direction

- **Style**: Clean professional
- **Theme**: Light-first (cream surface, white cards, oat borders)
- **Accent**: Orange untuk aksi utama dan status aktif
- **Typography**: Inter (existing)
- **Scope**: Seluruh halaman scoring (layout, komponen, interaksi)

## Information Architecture

### Desktop / Tablet

Halaman dibagi menjadi dua area:

1. **Main Form Area (kiri, dominan)**
   - Menampilkan konten step aktif (Invoice, Transaksi, Marketplace, Profil Bisnis).
   - Fokus utama input user.

2. **Progress & Summary Panel (kanan, sticky)**
   - Menampilkan step progress dengan status aktif/selesai/pending.
   - Checklist validasi ringan per langkah.
   - Ringkasan data yang sudah terisi.
   - Persentase completion real-time.

### Mobile

- Tetap single-column.
- Progress panel dipindah ke bawah sebagai blok collapsible/accordion agar tidak memenuhi viewport atas.

## Component Design

### 1. Page Shell

- Background: `#faf9f6`
- Card: putih dengan border `#dedbd6`
- Spacing vertikal diperluas agar tidak sesak.

### 2. Step Progress Rail

- Visual status:
  - **Active**: orange (`#ff5600`)
  - **Completed**: hijau (`#2c6415`)
  - **Pending**: oat/neutral
- Dilengkapi label step yang jelas dan progress line yang terhubung.

### 3. Form Cards

- Header card berisi:
  - judul langkah,
  - deskripsi singkat,
  - progress mini.
- Field design:
  - label lebih kontras,
  - helper/error text konsisten,
  - border/focus state selaras dengan sistem warna baru.

### 4. Action Area

- Tombol utama (Next / Submit) konsisten di sisi kanan.
- Tombol secondary (Back) gaya outline.
- CTA utama selalu orange untuk konsistensi orientasi tindakan.

### 5. Summary Panel

- Menampilkan:
  - completion percent,
  - daftar “sudah terisi / belum terisi”,
  - preview nilai penting (contoh: jumlah transaksi, lokasi usaha).
- Ditujukan untuk mengurangi kebingungan sebelum submit.

## Interaction and Feedback

- Validasi per-field tampil inline, tidak menunggu submit penuh.
- Saat submit gagal validasi, tampil ringkasan error ringan di atas form.
- Tombol **Next** nonaktif sampai field wajib langkah aktif valid.
- Completion percent diperbarui real-time saat input berubah.
- Micro-interaction halus:
  - hover,
  - press,
  - fade transition
  tanpa efek berlebihan.

## Data Flow & State

- Sumber state utama tetap `react-hook-form` + provider existing.
- Step controller tetap digunakan, ditambah status validitas per langkah.
- Summary panel membaca state form secara live untuk menampilkan ringkasan.

## Error Handling

- Error schema tetap berbasis Zod.
- Field invalid diberi:
  - border error,
  - pesan error spesifik,
  - status pada step panel (misalnya “belum lengkap”).
- Tidak ada silent failure; user selalu diberi indikator yang dapat ditindaklanjuti.

## Testing Strategy

- Cek visual responsif:
  - desktop,
  - tablet,
  - mobile.
- Cek alur step:
  - next/back,
  - disabled state,
  - completion progress.
- Cek validasi:
  - inline error per field,
  - error summary saat submit invalid.
- Cek konsistensi warna dan tipografi terhadap sistem light-first yang sudah dipilih.

## Out of Scope

- Perubahan business logic scoring.
- Integrasi backend baru.
- Redesign halaman result (kecuali ada dependency visual minor dari komponen bersama).
