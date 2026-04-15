# Landing Security Section Design

## Problem

Landing page sudah rapi, tetapi belum cukup menjawab kekhawatiran user soal keamanan data. Akibatnya, user bisa ragu untuk lanjut ke proses scoring.

## Goal

Menambah section **Keamanan Data** di landing agar:
- rasa percaya user naik,
- pesan keamanan mudah dipahami pelaku UMKM,
- alur menuju halaman scoring tetap kuat.

## Design Direction

- **Scope**: tanpa page baru, hanya section baru di landing.
- **Tone**: bahasa sederhana untuk UMKM, minim istilah teknis.
- **Style**: light-first, konsisten dengan tema sekarang.
- **Accent**: orange untuk penekanan ringan dan CTA.

## Information Architecture

Section baru ditempatkan:
1. setelah section fitur utama,
2. sebelum FAQ/footer.

Struktur section:
1. Heading + subheading singkat.
2. Grid 3 kartu keamanan.
3. CTA kecil ke `/scoring`.

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
- Card: putih dengan border oat (`#dedbd6`), radius 8px.
- Icon: outline kecil, warna orange (`#ff5600`).
- Judul kartu: off-black (`#111111`), body text (`#626260`).
- Hover: border bergeser ke orange, tanpa efek berlebihan.

## Interaction

- Tambah anchor id di section keamanan agar bisa ditautkan dari nav.
- CTA section:
  - teks: `Mulai Scoring Aman`
  - target: `/scoring`
- Tidak ada interaksi kompleks; fokus pada keterbacaan dan trust.

## Implementation Surface

- `frontend/components/landing/LandingPage.tsx`
  - tambah section baru + konten kartu + CTA.
- `frontend/components/Navbar.tsx`
  - tambah tautan anchor `Keamanan Data` ke landing.
- `frontend/components/landing/Footer.tsx` (opsional ringan)
  - tambah tautan internal ke anchor keamanan bila perlu.

## Error Handling

Karena ini section statis, tidak ada error runtime khusus. Pastikan:
- link anchor valid,
- CTA mengarah ke route yang aktif.

## Testing Strategy

- Cek responsif mobile/tablet/desktop.
- Cek konsistensi visual dengan section landing lain.
- Cek link anchor `#keamanan-data`.
- Cek CTA ke `/scoring`.

## Out of Scope

- Pembuatan page baru `/keamanan-data`.
- Penambahan compliance framework detail (ISO/SOC/GDPR).
- Perubahan alur backend atau penyimpanan data.
