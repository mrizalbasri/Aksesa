# 🏦 SmartScore UMKM(Aksesa)
### AI-Powered Alternative Credit Scoring for Indonesian SMEs

> Submission for **AI Impact Challenge** — Microsoft Elevate Training Center x Dicoding x Komdigi  
> Category: **Real Sector Economy — Akses Pembiayaan & Credit Scoring UMKM (No. 19)**

---

## 📌 Latar Belakang

UMKM menyumbang lebih dari 60% PDB Indonesia, namun lebih dari 70% pelaku UMKM kesulitan mengakses pembiayaan formal karena tidak memiliki laporan keuangan resmi. **SmartScore UMKM** hadir sebagai solusi credit scoring alternatif berbasis AI yang menggunakan data non-formal untuk menilai kelayakan kredit pelaku UMKM.

---

## 💡 Solusi

SmartScore UMKM adalah platform web berbasis AI yang memungkinkan pelaku UMKM mendapatkan skor kredit berdasarkan **data alternatif** seperti:

- Foto nota / invoice penjualan
- Riwayat transaksi harian sederhana
- Data penjualan marketplace (Tokopedia, Shopee, dll)
- Profil bisnis (lama usaha, lokasi, jumlah karyawan)

---

## ✨ Fitur Utama

### 1. 📄 Input Data Alternatif
- Upload foto nota/invoice → diproses dengan **Azure Document Intelligence (OCR)**
- Form input transaksi harian yang sederhana dan ramah pengguna
- Input manual data marketplace

### 2. 🤖 AI Credit Scoring Engine
- Model Machine Learning menghitung skor kredit **0–100**
- Kategori hasil:
  - 🔴 **Risiko Tinggi** (0–40)
  - 🟡 **Risiko Sedang** (41–70)
  - 🟢 **Layak Kredit** (71–100)
- Explainable AI — setiap faktor pembentuk skor ditampilkan secara transparan

### 3. 📊 Dashboard Hasil & Rekomendasi
- Visualisasi skor dengan gauge chart interaktif
- Analisis narasi otomatis dari **Azure OpenAI (GPT-4o)**
- Rekomendasi personal: *"Untuk meningkatkan skor Anda, langkah yang bisa diambil adalah..."*

### 4. 💰 Simulasi Pinjaman
- Input nominal pinjaman yang diinginkan
- Sistem merekomendasikan tenor & estimasi cicilan yang realistis berdasarkan skor

### 5. 📑 Export Laporan PDF
- Cetak hasil scoring sebagai dokumen resmi
- Dapat dibawa ke bank, koperasi, atau lembaga keuangan

---

## 🏗️ Arsitektur Teknis

```
User (UMKM)
    │
    ▼
Frontend (React / Next.js)
    │
    ▼
Backend API (Python FastAPI)
    │
    ├── Azure Document Intelligence  → OCR nota/invoice
    ├── Azure Machine Learning       → Credit scoring model
    ├── Azure OpenAI (GPT-4o)        → Rekomendasi & narasi
    └── Azure Blob Storage           → Penyimpanan dokumen
    │
    ▼
Azure SQL / Cosmos DB
    │
    ▼
Azure App Service (Hosting)
```

---

## ☁️ Azure Services yang Digunakan

| Azure Service | Fungsi |
|---|---|
| **Azure Machine Learning** | Model credit scoring utama |
| **Azure OpenAI (GPT-4o)** | Generate rekomendasi & analisis narasi |
| **Azure Document Intelligence** | OCR untuk membaca nota dan invoice |
| **Azure App Service** | Hosting web application |
| **Azure Blob Storage** | Penyimpanan dokumen yang diupload user |
| **Azure SQL Database** | Penyimpanan data scoring & user |

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React.js / Next.js |
| Backend | Python (FastAPI) |
| ML Model | Scikit-learn / Azure AutoML |
| Database | Azure SQL / Cosmos DB |
| Hosting | Azure App Service |
| OCR | Azure Document Intelligence |
| AI | Azure OpenAI GPT-4o |

---

## 🚀 Cara Menjalankan (Development)

### Prerequisites
- Python 3.10+
- Node.js 18+
- Azure Student Account (dengan credit aktif)

### Backend
```bash
# Clone repository
git clone https://github.com/username/smartscore-umkm.git
cd smartscore-umkm/backend

# Install dependencies
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Isi AZURE_OPENAI_KEY, AZURE_ML_ENDPOINT, dll

# Jalankan server
uvicorn main:app --reload
```

### Frontend
```bash
cd ../frontend

# Install dependencies
npm install

# Jalankan dev server
npm run dev
```

---

## 📁 Struktur Folder

```
smartscore-umkm/
├── backend/
│   ├── main.py                 # FastAPI entry point
│   ├── routes/
│   │   ├── scoring.py          # Credit scoring endpoint
│   │   └── documents.py        # Document upload & OCR
│   ├── services/
│   │   ├── azure_ml.py         # Azure ML integration
│   │   ├── azure_openai.py     # GPT-4o integration
│   │   └── azure_docintel.py   # Document Intelligence
│   ├── models/
│   │   └── credit_model.pkl    # Trained ML model
│   └── requirements.txt
├── frontend/
│   ├── pages/
│   │   ├── index.tsx           # Landing page
│   │   ├── scoring.tsx         # Form input & scoring
│   │   └── result.tsx          # Dashboard hasil
│   ├── components/
│   │   ├── ScoreGauge.tsx      # Visualisasi skor
│   │   ├── UploadForm.tsx      # Upload dokumen
│   │   └── RecommendationCard.tsx
│   └── package.json
├── ml/
│   ├── train_model.py          # Training script
│   ├── dataset/                # Sample dataset
│   └── notebooks/              # EDA & eksperimen
├── README.md
└── .env.example
```

---

## 🎯 Relevansi dengan Kriteria Penilaian

| Kriteria | Bobot | Implementasi |
|---|---|---|
| **Inovasi & Kebaruan** | 25% | Pendekatan credit scoring alternatif dengan data non-formal, berbeda dari sistem perbankan konvensional |
| **Desain & UX** | 25% | UI yang sederhana dan ramah pengguna awam, dirancang untuk pelaku UMKM non-teknis |
| **Pemanfaatan AI & Azure** | 30% | Menggunakan 6 layanan Azure secara terintegrasi: OpenAI, ML, Document Intelligence, App Service, Blob Storage, SQL |
| **Manfaat untuk Masyarakat** | 20% | Menyasar 64 juta+ UMKM Indonesia yang kesulitan akses pembiayaan formal |

---

## 📈 Dampak yang Diharapkan

- ✅ Memperluas akses pembiayaan bagi UMKM yang tidak bankable secara konvensional
- ✅ Mengurangi ketergantungan pada pinjaman informal berbunga tinggi
- ✅ Meningkatkan inklusi keuangan digital di Indonesia
- ✅ Mendukung pertumbuhan ekonomi sektor riil

---

## 👤 Tim / Developer

| Nama | Role |
|---|---|
| [Nama Kamu] | Full-stack Developer & AI Engineer |

---

## 📄 Lisensi

MIT License — bebas digunakan untuk keperluan edukasi dan pengembangan lebih lanjut.

---

> 💬 *"Setiap UMKM berhak mendapat akses modal yang adil. SmartScore UMKM hadir untuk mewujudkannya."*
