# Aksesa - Architecture Gap-to-Target and Roadmap Design

**Tanggal**: 2026-04-15  
**Topik**: Arsitektur keseluruhan dan prioritas roadmap dari MVP ke production  
**Status**: Approved for implementation planning

## 1. Problem Statement

Struktur proyek Aksesa sudah terbagi jelas (frontend, backend, ml), tetapi implementasi saat ini masih berada di tahap scaffold:

1. Backend masih terpusat di `backend/main.py` dengan endpoint placeholder.
2. `backend/routes/` dan `backend/models/` masih kosong.
3. Integrasi Azure di `backend/services/` belum diimplementasikan.
4. Frontend scoring/result masih dominan mock flow.
5. ML pipeline masih placeholder dan belum terhubung sebagai layanan scoring yang stabil.

Tanpa desain target yang tegas, roadmap berisiko memproduksi fitur cepat tetapi menghasilkan coupling tinggi dan utang arsitektur.

## 2. Goals and Scope

### In Scope

1. Menetapkan target arsitektur end-to-end yang tetap menjaga boundary frontend-backend-ml.
2. Menentukan gap teknis utama antara kondisi saat ini vs target.
3. Menetapkan urutan milestone dari MVP menuju production.
4. Menetapkan prinsip error handling, reliability, dan quality gate rilis.

### Out of Scope

1. Implementasi kode detail per file/module.
2. Desain UI visual baru.
3. Optimasi model ML lanjutan (fairness tuning, advanced experimentation).

## 3. Approaches Considered

### A. Gap-to-Target Architecture + Milestone Roadmap (**Selected**)

Mulai dari peta target arsitektur, identifikasi gap nyata di codebase saat ini, lalu turun ke urutan milestone implementasi.

**Kelebihan**:
- Seimbang antara kebutuhan delivery dan kesehatan arsitektur.
- Menghindari refactor besar di tengah jalan.
- Mudah dipakai sebagai baseline perencanaan sprint.

**Kekurangan**:
- Butuh disiplin awal pada kontrak API dan boundary modul.

### B. Risk-First Roadmap

Fokus mitigasi risiko teknis tertinggi lebih dulu (security, observability, infra).

**Kelebihan**:
- Risiko operasional turun cepat.

**Kekurangan**:
- Progress fitur user-facing cenderung lebih lambat.

### C. Flow-First Roadmap

Prioritaskan jalur user end-to-end paling cepat untuk demo.

**Kelebihan**:
- Time-to-demo cepat.

**Kekurangan**:
- Utang teknis cenderung menumpuk lebih awal.

## 4. Target Architecture

### 4.1 Frontend (Next.js)

1. Menangani UX flow, validasi input, dan rendering hasil.
2. Tidak menyimpan logika skor inti di client.
3. Mengkonsumsi response backend yang typed/terstruktur untuk:
   - score summary
   - factor breakdown
   - recommendation payload
   - report metadata

### 4.2 Backend (FastAPI)

1. Menjadi orchestration layer utama untuk proses scoring.
2. Memecah endpoint ke `routes/` dan schema ke model/Pydantic terpisah.
3. Menjaga domain service yang eksplisit:
   - input validation and normalization
   - OCR extraction adapter
   - feature building
   - scoring inference adapter
   - recommendation adapter
4. Menyimpan hasil scoring untuk histori dan audit.

### 4.3 ML Layer

1. Memisahkan pipeline training dari runtime inference.
2. Menetapkan model artifact versioning yang jelas.
3. Menyediakan interface inference yang konsisten ke backend adapter.

## 5. Component Boundaries

1. **Pages and forms (frontend)**: input dan presentasi data.
2. **API contracts (backend)**: kontrak request/response stabil per versi endpoint.
3. **Business orchestration (backend services)**: urutan proses scoring.
4. **External adapters**: Azure OpenAI, Azure ML, Azure Document Intelligence.
5. **Persistence**: simpan request ringkas, hasil skor, status proses, metadata model.

Boundary ini memastikan setiap unit bisa dipahami, diuji, dan diganti tanpa memecahkan consumer lain.

## 6. End-to-End Data Flow

1. User submit form scoring dari frontend.
2. Backend menerima payload terstruktur dan melakukan validasi.
3. Backend menjalankan pipeline:
   - OCR parsing (opsional jika ada dokumen)
   - feature normalization
   - scoring inference
   - recommendation generation
4. Backend menyimpan hasil dan mengembalikan response typed.
5. Frontend menampilkan result dashboard + PDF export dari data resmi backend.

## 7. Error Handling and Reliability

1. **Input errors (4xx)**: field-level error yang bisa dipetakan langsung ke UI.
2. **External service errors (5xx classified)**:
   - timeout
   - authentication/authorization
   - quota/rate-limit
3. **Partial failure policy**: hasil harus ditandai eksplisit jika sebagian proses gagal; tidak boleh success palsu.
4. **Retry policy**: retry terbatas hanya untuk error transient, dengan logging yang dapat ditelusuri.
5. **Observability minimum**: request-id, latency, error-rate, dan sumber kegagalan.

## 8. Roadmap Milestones (MVP to Production)

1. **Milestone 1 - Contract and Core Domain**
   - Struktur route backend
   - schema request/response
   - domain scoring service
   - penyimpanan hasil dasar

2. **Milestone 2 - End-to-End MVP**
   - frontend scoring terhubung ke backend nyata
   - result page mengonsumsi response backend, bukan mock
   - skor + faktor + rekomendasi tampil konsisten

3. **Milestone 3 - Azure Enablement**
   - aktifkan adapter OCR, Azure ML, OpenAI
   - fallback/degradation behavior eksplisit
   - validasi konfigurasi environment

4. **Milestone 4 - Production Hardening**
   - authentication/JWT
   - audit log
   - error taxonomy
   - rate limit dan security baseline

5. **Milestone 5 - Scale and Governance**
   - quality gate CI wajib
   - model/API versioning policy
   - rollback strategy
   - SLO monitoring baseline

## 9. Quality and Testing Strategy

1. Frontend: lint + type-check wajib sebelum merge.
2. Backend: startup sanity, contract tests endpoint utama, dan integration test orchestration.
3. End-to-end: validasi alur submit scoring sampai render hasil.
4. Release gate: tidak ada endpoint utama yang hanya placeholder pada environment target release.

## 10. Acceptance Criteria

1. Ada arsitektur target yang jelas per layer dengan boundary tegas.
2. Gap saat ini vs target terdokumentasi dan dapat dieksekusi.
3. Urutan milestone MVP ke production disetujui.
4. Error handling dan quality gate rilis terdokumentasi eksplisit.
5. Dokumen siap diturunkan ke implementation plan.
