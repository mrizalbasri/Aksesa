# Landing Trust Ribbon Design

## Context

Landing page sudah lebih rapi, tetapi masih butuh sinyal kepercayaan yang cepat terlihat untuk user baru. Target perubahan adalah menambah elemen trust ringkas tanpa membuat tampilan jadi ramai.

## Scope

In scope:
- Menambah komponen baru `TrustRibbon` tepat di bawah hero.
- Menampilkan 3-4 badge trust ringkas sebagai sinyal verifikasi proses.
- Menjaga gaya visual minimal dan konsisten dengan desain landing saat ini.

Out of scope:
- Perubahan layout besar di section lain.
- Penambahan backend/API.
- Scroll animation besar.
- Penambahan library baru.

## Approaches Considered

### A) Trust Ribbon (Selected)
- Satu baris badge trust di bawah hero.
- Pros: paling cepat dipahami user baru, tidak menambah noise konten.
- Cons: ruang visual tambahan perlu dijaga agar tetap ringan.

### B) Inline Trust Chips
- Trust chip disebar di beberapa section heading.
- Pros: menyatu dengan section.
- Cons: sinyal trust terpecah dan kurang langsung terlihat.

### C) Sticky Trust Note
- Kartu trust kecil sticky saat scroll desktop.
- Pros: persistensi tinggi.
- Cons: berpotensi mengganggu dan terlalu menonjol untuk style minimal.

## Approved Design

### 1) Placement and Structure
- Tambah `TrustRibbon` di antara hero dan section Kapabilitas.
- Ribbon berisi list badge horizontal dengan ikon + label pendek.
- Label dirancang sangat singkat agar cepat discan.

### 2) Content
Contoh label awal:
- `OCR Verified`
- `Data Terenkripsi`
- `Proses Transparan`
- `Siap Audit`

### 3) Visual and Interaction
- Background netral hangat, border tipis, dan separasi badge yang halus.
- Hover/focus ringan pada badge (tanpa animasi berlebihan).
- Tidak ada scroll animation lintas section.
- Mobile: horizontal scroll yang halus jika badge melebihi lebar layar.

### 4) Accessibility
- Gunakan semantic list (`ul/li`) untuk badge.
- Pastikan fokus keyboard jelas.
- Pertahankan kontras teks terhadap latar.

## Technical Design

- File baru: `frontend/components/landing/TrustRibbon.tsx`
- Integrasi: `frontend/components/landing/LandingPage.tsx`
- Data badge disimpan sebagai array statis lokal dalam komponen atau module-level constant.
- Tidak ada perubahan state backend, API client, atau storage.

## Error Handling and Safety

- Karena fitur statis presentasional, risiko regresi fungsional rendah.
- Hindari kondisi overflow yang mengganggu dengan `overflow-x-auto` pada mobile.

## Validation

- Frontend `type-check` harus lolos.
- Frontend `build` harus sukses.
- Visual check: ribbon terlihat jelas sebagai trust signal namun tetap minimal.

## Definition of Done

- Trust Ribbon tampil konsisten di desktop dan mobile.
- Badge trust terbaca jelas dalam 1-2 detik scan.
- Landing terasa lebih meyakinkan untuk user baru tanpa penambahan keramaian.
