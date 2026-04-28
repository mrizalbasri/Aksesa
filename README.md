# 🏦 Aksesa
## AI-Powered Alternative Credit Scoring for Indonesian SMEs

<div align="center">

**Submission for AI Impact Challenge** — Microsoft Elevate Training Center × Dicoding × Komdigi  
Category: **Real Sector Economy — Akses Pembiayaan & Credit Scoring UMKM (No. 19)**

[🚀 Quick Start](#-quick-start) • [📋 Fitur](#-fitur-utama) • [🏗️ Arsitektur](#-arsitektur) • [📦 Deploy](#-deployment) • [👥 Tim](#-tim)

</div>

---

## 📌 Latar Belakang

**Masalah:**
- UMKM menyumbang **60%+ PDB Indonesia** namun hanya **30%** yang mendapat akses pembiayaan formal
- **70%+ pelaku UMKM** tidak memiliki laporan keuangan resmi → ditolak perbankan
- Terpaksa bergantung pada pinjaman informal berbunga **30-40% per tahun**
- **64 juta UMKM Indonesia** tidak ter-layani oleh sistem keuangan formal

**Solusi:**
Aksesa adalah platform credit scoring berbasis AI yang mengevaluasi kelayakan kredit UMKM menggunakan **data alternatif** (nota penjualan, transaksi harian, data marketplace) bukan laporan keuangan formal. Dengan pendekatan ini, UMKM yang sebelumnya "tidak bankable" kini dapat membuktikan creditworthiness mereka.

---

## ✨ Fitur Utama

### 1. 📄 **Input Data Alternatif**
- ✅ Upload foto nota/invoice → diproses dengan **Azure Document Intelligence (OCR)**
- ✅ Form input transaksi harian yang simple & ramah pengguna
- ✅ Input manual data marketplace (Tokopedia, Shopee, dll)
- ✅ Profil bisnis (lama usaha, lokasi, jumlah karyawan)

### 2. 🤖 **AI Credit Scoring Engine**
- ✅ Machine Learning model menghitung skor kredit **0–100** (Explainable AI)
- ✅ Kategori risk transparan:
  - 🔴 **Risiko Tinggi** (0–40) — Ditolak
  - 🟡 **Risiko Sedang** (41–70) — Conditional approval
  - 🟢 **Layak Kredit** (71–100) — Approved
- ✅ Setiap faktor pembentuk skor ditampilkan untuk transparansi

### 3. 📊 **Dashboard Hasil & Rekomendasi**
- ✅ Visualisasi skor dengan gauge chart interaktif
- ✅ Analisis narasi otomatis dari **Azure OpenAI (GPT-4o)**
- ✅ Rekomendasi personal: *"Untuk meningkatkan skor Anda, langkah yang bisa diambil adalah..."*
- ✅ Laporan detail dengan kontribusi setiap faktor

### 4. 💰 **Simulasi Pinjaman**
- ✅ Input nominal pinjaman yang diinginkan
- ✅ Sistem merekomendasikan tenor & estimasi cicilan berdasarkan skor
- ✅ Perhitungan bunga yang realistis & transparan

### 5. 📑 **Export Laporan PDF**
- ✅ Cetak hasil scoring sebagai dokumen resmi
- ✅ Dapat dibawa ke bank, koperasi, atau lembaga keuangan
- ✅ Include detil scoring, rekomendasi, & simulasi pinjaman

---

## 🏗️ Arsitektur

```
┌─────────────────────────────────────────────────────────────┐
│                      USER (UMKM)                            │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Frontend (Next.js + React + Tailwind + shadcn/ui)  │  │
│  │  ✓ Landing page                                      │  │
│  │  ✓ Scoring form (invoice upload + transaction data) │  │
│  │  ✓ Result dashboard dengan gauge chart              │  │
│  │  ✓ Loan simulation                                   │  │
│  │  ✓ Auth (login/signup)                               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓ REST API
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API (FastAPI)                    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Routes & Endpoints                                │    │
│  │  ✓ POST /auth/login              → JWT auth       │    │
│  │  ✓ POST /auth/register           → User creation  │    │
│  │  ✓ POST /api/v1/scoring          → Score estimate │    │
│  │  ✓ POST /api/v1/documents/ocr    → Invoice OCR    │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Service Layer                                     │    │
│  │  ✓ ml_service.py        → Load model, predict     │    │
│  │  ✓ azure_openai.py      → Generate rekomendasi   │    │
│  │  ✓ azure_docintel.py    → OCR invoice images     │    │
│  │  ✓ auth_service.py      → JWT token handling     │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Database (SQLAlchemy ORM)                         │    │
│  │  ✓ Users table                                     │    │
│  │  ✓ Scoring results table                           │    │
│  │  ✓ Audit logs                                      │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                ↓ Integrations & Data Store
┌─────────────────────────────────────────────────────────────┐
│                    AZURE CLOUD SERVICES                      │
│                                                              │
│  🧠 Azure OpenAI (GPT-4o)    → Generate recommendations    │
│  🔍 Document Intelligence    → OCR invoice scanning        │
│  🤖 Azure ML                 → Model hosting (optional)    │
│  💾 Blob Storage             → Store uploaded documents    │
│  🗄️  SQL Database             → Application data store     │
│  📊 Application Insights     → Monitoring & logging        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## ☁️ Azure Services Digunakan

| Service | Fungsi | Status |
|---------|--------|--------|
| **Azure OpenAI (GPT-4o)** | Generate rekomendasi personal & analisis narasi | ✅ Integrated |
| **Document Intelligence** | OCR untuk membaca nota dan invoice otomatis | ✅ Integrated |
| **App Service** | Hosting frontend (Next.js) & backend (FastAPI) | ✅ Integrated |
| **Blob Storage** | Penyimpanan dokumen yang diupload user | ✅ Integrated |
| **SQL Database** | Penyimpanan user data & scoring results | ✅ Integrated |
| **Application Insights** | Monitoring, logging, dan analytics | ✅ Integrated |

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Next.js 14 + TypeScript | Web UI & routing |
| **Styling** | Tailwind CSS + shadcn/ui | Modern UI components |
| **Form** | react-hook-form + Zod | Type-safe form validation |
| **Backend** | Python 3.11 + FastAPI | REST API server |
| **Database** | Azure SQL + SQLAlchemy ORM | Data persistence |
| **ML Model** | Scikit-learn RandomForest | Credit scoring prediction |
| **OCR** | Azure Document Intelligence | Invoice scanning |
| **LLM** | Azure OpenAI (GPT-4o) | Rekomendasi generation |
| **Hosting** | Docker + Azure App Service | Production deployment |
| **Infrastructure** | Bicep + Azure DevOps CLI | IaC & automation |

---

## 🎯 Relevansi dengan Kriteria Penilaian

| Kriteria | Bobot | ⭐ Implementasi Aksesa |
|----------|-------|------------------------|
| **Inovasi & Kebaruan** | 25% | ✅ Credit scoring alternatif dengan data non-formal → Belum ada di market. Berbeda dari sistem perbankan konvensional. |
| **Desain & UX** | 25% | ✅ UI sederhana, minimalis, ramah untuk UMKM non-teknis. Accessibility-first design. |
| **Pemanfaatan AI & Azure** | 30% | ✅ **6 layanan Azure** terintegrasi: OpenAI, ML, Document Intelligence, App Service, Blob, SQL. E2E AI pipeline. |
| **Manfaat untuk Masyarakat** | 20% | ✅ Target **64 juta UMKM** yang unbanked. Impact terukur pada financial inclusion. |

---

## 📈 Value Proposition

### Untuk UMKM
- 🟢 **Akses Modal**: Dapat akses kredit meski tanpa laporan keuangan formal
- 🟢 **Transparansi**: Mengerti kenapa diterima/ditolak + cara meningkatkan score
- 🟢 **Kecepatan**: Hasil scoring instan, bukan butuh beberapa minggu
- 🟢 **Dokumentasi**: Laporan PDF yang bisa dibawa ke bank/koperasi

### Untuk Lembaga Keuangan
- 📊 **Risk Assessment**: Scoring berbasis AI lebih akurat dari heuristic
- 📊 **Efisiensi**: Otomasi proses scoring mengurangi biaya operasional
- 📊 **Reach Baru**: Dapat akses ke market UMKM yang sebelumnya untapped

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (Frontend)
- **Python** 3.10+ (Backend)
- **Git**
- (Optional) **Docker** untuk local containerized testing

### Development Setup

#### 1️⃣ Clone & Install Dependencies

```bash
# Clone repo
git clone https://github.com/mrizalbasri/Aksesa.git
cd Aksesa

# Frontend
cd frontend
npm install

# Backend
cd ../backend
pip install -r requirements.txt

# ML
cd ../ml
pip install -r requirements.txt
```

#### 2️⃣ Configure Environment Variables

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` dengan Azure credentials (atau gunakan fallback Groq):

```bash
# Azure OpenAI (optional, ada fallback Groq)
AZURE_OPENAI_API_KEY=your_key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/

# Document Intelligence (optional)
AZURE_DOC_INTEL_ENDPOINT=...
AZURE_DOC_INTEL_KEY=...

# Database (optional, default SQLite)
# DB_SQLITE_PATH=./aksesa.db
# OR Azure SQL
AZURE_SQL_SERVER=...
```

#### 3️⃣ Train ML Model

```bash
cd ml
python train_model.py
# Output: ml/models/credit_model.pkl, ml/models/scaler.pkl
```

#### 4️⃣ Start Development Servers

```bash
# Terminal 1: Frontend (http://localhost:3000)
cd frontend
npm run dev

# Terminal 2: Backend (http://localhost:8000)
cd backend
python -m uvicorn main:app --reload

# Terminal 3: Test (optional)
curl http://localhost:8000/health
```

#### 5️⃣ Test the App

1. Open http://localhost:3000/
2. Click "Mulai Scoring" → `/scoring`
3. Fill form + upload sample invoice image
4. Submit → See results!

---

## 📦 Deployment to Azure

### Option A: Azure Developer CLI (Recommended)

```bash
# 1. Install Azure Developer CLI
# https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/install-azd

# 2. Login to Azure
azd auth login

# 3. Deploy
azd up

# This will:
# - Create resource group
# - Deploy infrastructure (Bicep)
# - Build & push Docker images
# - Deploy to App Service
# - Configure Azure services
# - Grant SQL permissions
```

### Option B: Manual Azure Portal (if needed)

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for step-by-step guide.

---

## 📁 Project Structure

```
aksesa/
├── frontend/                       # React + Next.js app
│   ├── pages/
│   │   ├── index.tsx              # Landing page
│   │   ├── login.tsx              # Authentication
│   │   ├── scoring.tsx            # Form + scoring
│   │   ├── result.tsx             # Dashboard hasil
│   │   └── demo.tsx               # Demo mode
│   ├── components/
│   │   ├── ui/                    # shadcn/ui primitives
│   │   ├── landing/               # Landing page components
│   │   └── scoring/               # Scoring form components
│   ├── lib/
│   │   ├── api.ts                 # API client
│   │   ├── validators.ts          # Zod schemas
│   │   └── auth.ts                # Auth utilities
│   ├── Dockerfile                 # Multi-stage Node.js build
│   └── package.json
│
├── backend/                        # FastAPI server
│   ├── main.py                    # App entry point
│   ├── routes/
│   │   ├── auth.py                # Auth endpoints
│   │   ├── scoring.py             # Scoring endpoint
│   │   └── results.py             # Results endpoint
│   ├── services/
│   │   ├── ml_service.py          # Model loading & prediction
│   │   ├── azure_openai.py        # OpenAI integration
│   │   ├── azure_docintel.py      # OCR integration
│   │   └── auth_service.py        # JWT handling
│   ├── database/
│   │   ├── models.py              # SQLAlchemy ORM models
│   │   ├── dependencies.py        # get_db()
│   │   └── repositories.py        # Data access layer
│   ├── schemas/
│   │   ├── auth.py                # Pydantic schemas
│   │   └── scoring.py             # Request/response schemas
│   ├── Dockerfile                 # Multi-stage Python build
│   ├── requirements.txt            # Python dependencies
│   └── .env.example               # Environment template
│
├── ml/                            # ML training
│   ├── train_model.py             # Model training script
│   ├── models/                    # Trained models
│   │   ├── credit_model.pkl       # Random Forest model
│   │   └── scaler.pkl             # Feature scaler
│   └── dataset/                   # Sample training data
│
├── infra/                         # Infrastructure as Code
│   ├── main.bicep                 # Bicep template
│   └── main.parameters.json       # Parameters
│
├── scripts/
│   ├── grant-sql-access.sh        # Post-provision (Linux/Mac)
│   └── grant-sql-access.ps1       # Post-provision (Windows)
│
├── azure.yaml                     # Azure Developer CLI config
├── docker-compose.yml             # Local docker-compose (if needed)
├── README.md                       # This file
├── DEPLOYMENT.md                  # Detailed deployment guide
├── JUDGES_GUIDE.md                # Quick start for judges
└── .env.example                   # Root env template
```

---

## 🧪 Testing & Quality

### Frontend

```bash
cd frontend

# TypeScript type checking
npm run type-check

# ESLint
npm run lint

# Build
npm run build

# Start production build
npm run start
```

### Backend

```bash
cd backend

# Check Python syntax
python -m py_compile main.py routes/*.py services/*.py

# Start server (auto-reload)
python -m uvicorn main:app --reload
```

### API Documentation

Swagger API docs tersedia di: `http://localhost:8000/docs`

---

## 📝 Key Features & Implementation

### ✅ Authentication
- JWT-based auth dengan secure httpOnly cookies
- Login/signup dengan email
- Demo account untuk testing

### ✅ Document Processing
- OCR via Azure Document Intelligence
- Automatic invoice number & amount extraction
- Fallback jika Azure unavailable

### ✅ ML Scoring
- Random Forest classifier (scikit-learn)
- Feature scaling & normalization
- Explainable predictions dengan feature importance

### ✅ LLM Recommendations
- Azure OpenAI GPT-4o untuk rekomendasi personal
- Fallback ke Groq jika Azure keys unavailable
- Context-aware, specific recommendations

### ✅ Data Persistence
- SQLAlchemy ORM (database agnostic)
- SQLite untuk development
- Azure SQL untuk production

### ✅ API Design
- RESTful endpoints
- Proper error handling & status codes
- CORS configuration untuk frontend

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📞 Support & Documentation

- **Quick Start**: See [Quick Start](#-quick-start) above
- **Deployment**: See [DEPLOYMENT.md](./DEPLOYMENT.md)
- **For Judges**: See [JUDGES_GUIDE.md](./JUDGES_GUIDE.md)
- **Developer Guide**: See [AGENTS.md](./AGENTS.md)
- **API Docs**: Run backend, go to `http://localhost:8000/docs`

---

## 👥 Tim

| Nama | Role |
|------|------|
| M. Rizal Basri | Full-Stack Developer & AI Engineer |

---

## 📄 Lisensi

MIT License — Bebas digunakan untuk keperluan edukasi dan pengembangan lebih lanjut.

---

## 🎯 Roadmap (Future)

- [ ] Integration dengan API marketplace (Tokopedia, Shopee, Bukalapak)
- [ ] Blockchain-based certificate untuk scoring results
- [ ] Mobile app (React Native)
- [ ] Kerjasama dengan fintech partners untuk real loan disbursement
- [ ] Advanced analytics dashboard untuk lenders
- [ ] Multi-language support

---

<div align="center">

### 💬 "Setiap UMKM berhak mendapat akses modal yang adil. Aksesa hadir untuk mewujudkannya."

**Made with ❤️ for Indonesian SMEs**

[Report Issue](https://github.com/mrizalbasri/Aksesa/issues) • [Request Feature](https://github.com/mrizalbasri/Aksesa/discussions)

</div>
