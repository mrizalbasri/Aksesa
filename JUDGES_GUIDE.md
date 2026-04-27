# 👨‍⚖️ Judges' Quick Start Guide

**Welcome!** Panduan singkat ini membantu Anda test aplikasi **Aksesa** dalam **10 menit**.

---

## 🚀 Complete Local Setup: 10 Minutes

**This is the primary testing path** (No Azure deployment needed)

### Requirements

```
✓ Git
✓ Node.js 18+
✓ Python 3.10+
```

### Step 1: Clone & Install (3 minutes)

```bash
# Clone
git clone https://github.com/username/aksesa.git
cd aksesa

# Install frontend
cd frontend
npm install

# Install backend
cd ../backend
pip install -r requirements.txt

# ML (already trained)
cd ../ml
# Models exist at ml/models/credit_model.pkl ✅
```

### Step 2: Setup Environment (1 minute)

```bash
cd backend
cp .env.example .env
```

**✅ Done!** Default `.env` is already configured for local testing:
- ✓ SQLite database (no setup needed)
- ✓ Demo credentials pre-configured
- ✓ Fallback LLM enabled (Groq)
- ✓ CORS already set for localhost

**Optional**: If you want to use Azure services, add your keys to `.env`

### Step 3: Train ML Model (1 minute - SKIP if models exist)

```bash
# Check if models exist (they should)
ls ml/models/
# Output: credit_model.pkl  scaler.pkl

# If missing, train:
cd ml
python train_model.py
```

### Step 4: Start Servers (2 minutes)

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
# Opens http://localhost:3000
```

**Terminal 2 - Backend:**
```bash
cd backend
python -m uvicorn main:app --reload
# API available at http://localhost:8000
```

### Step 5: Test App (3 minutes)

#### 🎯 Flow 1: Quick Demo (No Login)

1. Go to http://localhost:3000/
2. Click **"Mulai Scoring"** → `/scoring`
3. Fill in form:
   - Transactions: `100000, 150000, 120000` (penjualan harian)
   - Business name: `Toko Kami`
   - Years: `3`
   - Employees: `2`
4. **Skip invoice upload** (optional)
5. Click **"Hitung Skor"**
6. ✅ See results:
   - Score: 0-100
   - Risk category: Layak Kredit / Risiko Sedang / Risiko Tinggi
   - Factors breakdown
   - AI recommendations

#### 🎯 Flow 2: Login & Full Test

1. Go to http://localhost:3000/login
2. Sign up OR use demo account:
   - Email: `demo@aksesa.id`
   - Password: `Aksesa123!`
3. After login, follow **Flow 1** above
4. Results save to database ✅
5. Can export PDF report

---

## 🧪 What to Test

### ✅ **Critical Features** (Must Work)

- [ ] Landing page loads
- [ ] "Mulai Scoring" button works
- [ ] Scoring form submits
- [ ] Results display with score gauge
- [ ] Score between 0-100
- [ ] Risk category shows (Layak Kredit / Risiko Sedang / Risiko Tinggi)
- [ ] Factors breakdown visible
- [ ] AI recommendations display (or fallback text)
- [ ] Can navigate to result dashboard

### ✅ **Optional Features** (Nice-to-Have)

- [ ] Login/signup flow works
- [ ] Invoice upload → OCR processes image
- [ ] Loan simulation calculates tenor
- [ ] PDF export works
- [ ] Results saved to database
- [ ] API docs visible at http://localhost:8000/docs

---

## 📊 Expected Results

### Sample Input
```
Transactions (daily sales):
  100,000 IDR (Day 1)
  150,000 IDR (Day 2)
  120,000 IDR (Day 3)

Business Profile:
  Name: Toko Kami
  Years in business: 3 years
  Employees: 2
```

### Expected Output
```
✅ Score: 65-75 (Risiko Sedang → Conditional Approval)

Factors:
  - Average daily sales: 123,333 IDR (Positive 🟢)
  - Business stability: 3 years (Positive 🟢)
  - Employee count: 2 (Neutral 🟡)
  - Missing: Invoice data (Negative 🔴)

AI Recommendations:
  "Untuk meningkatkan skor Anda, berikut saran yang bisa diambil:
   1. Tambahkan data penjualan minimal 3 bulan terakhir
   2. Upload invoice terbaru untuk memvalidasi penjualan
   3. Tingkatkan jumlah karyawan atau perlihatkan pertumbuhan omzet"

Loan Simulation (Input: 10 juta IDR):
  - Tenor: 24 bulan
  - Monthly payment: ~450,000 IDR
  - Interest rate: 8.5% per annum
```

---

## 🔗 Important URLs (All Local)

| What | URL | Purpose |
|------|-----|---------|
| **Landing page** | http://localhost:3000 | Homepage |
| **Scoring form** | http://localhost:3000/scoring | Main feature - fill form & get score |
| **Demo mode** | http://localhost:3000/demo | Pre-filled example |
| **Results page** | http://localhost:3000/result | See scoring results |
| **Login** | http://localhost:3000/login | User authentication |
| **Backend health** | http://localhost:8000/health | API status check |
| **API Swagger** | http://localhost:8000/docs | Full API documentation |

---

## 🎯 Evaluation Checklist (Per Judging Criteria)

### **1. Innovation & Novelty** (25%)
While testing, look for:
- ✅ Alternative data for credit scoring (not traditional financial statements)
- ✅ Explainable AI (shows why score is X, not just a number)
- ✅ Realistic for Indonesian UMKM use case
- ✅ Unique approach compared to traditional bank systems

### **2. Design & UX** (25%)
While testing, look for:
- ✅ Clean, minimalist interface (no clutter)
- ✅ Simple form (UMKM non-technical users can fill it)
- ✅ Visual scoring display (gauge chart)
- ✅ Clear risk categories (Layak Kredit / Risiko Sedang / Risiko Tinggi)
- ✅ Responsive design (works on desktop & mobile)

### **3. AI & Azure Integration** (30%)
Technical implementation:
- ✅ ML model predicts scores (scikit-learn Random Forest)
- ✅ LLM generates recommendations (Azure OpenAI or fallback Groq)
- ✅ Document OCR ready (uses Document Intelligence when available)
- ✅ Database stores results (SQLAlchemy ORM, SQLite local / Azure SQL prod)
- ✅ API well-structured (FastAPI with Swagger docs)

### **4. Social Impact** (20%)
Business value:
- ✅ Targets unbanked UMKM (64+ million in Indonesia)
- ✅ Solves real problem (UMKM can't access formal credit)
- ✅ Transparent scoring (users understand why approved/rejected)
- ✅ Actionable recommendations (how to improve score)
- ✅ Portable results (PDF export for bank/koperasi)

---

## ⚠️ Common Issues & Fixes

### **"Cannot connect to backend"**
```bash
# Make sure backend is running
cd backend
python -m uvicorn main:app --reload

# Check logs for errors
```

### **"ML models not found"**
```bash
# Train models
cd ml
python train_model.py
# Creates: ml/models/credit_model.pkl, ml/models/scaler.pkl
```

### **"Database error"**
```bash
# Delete old database and start fresh
cd backend
rm aksesa.db
# Restart backend → creates new DB automatically
```

### **"CORS error" in browser console**
```bash
# Make sure backend has correct ALLOWED_ORIGINS
# Edit backend/.env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000
```

### **"400 Bad Request" on form submit**
```bash
# Verify form input format in browser DevTools
# Check backend logs: python -m uvicorn main:app --reload

# Sample valid input:
{
  "transactions": [100000, 150000, 120000],
  "business_name": "Toko Kami",
  "business_years": 3,
  "num_employees": 2
}
```

---

## 🎨 What You'll See

### Flow: Landing → Scoring → Results

**Landing Page**
```
Hero: "Aksesa - AI-Powered Credit Scoring"
Tagline: "Akses modal untuk semua UMKM"
CTA Button: "Mulai Scoring"
```

**Scoring Form** (http://localhost:3000/scoring)
```
Step 1: Enter Transaction Data
  □ Daily sales (3+ entries): [100000] [150000] [120000] IDR
  
Step 2: Business Profile
  □ Business name: [Toko Kami]
  □ Years in business: [3]
  □ Number of employees: [2]
  
Step 3: Optional
  □ Upload invoice image (JPG/PNG)
  
[Calculate Score Button]
```

**Results Dashboard** (http://localhost:3000/result)
```
┌──────────────────────────────────────┐
│   AKSESA CREDIT SCORE: 72 / 100      │
│           LAYAK KREDIT               │
│   (Approved for Financing)           │
└──────────────────────────────────────┘

📊 Score Breakdown:
  • Average daily sales: 123,333 IDR → +15 points ✅
  • Business stability: 3 years → +12 points ✅
  • Employee count: 2 → +5 points ⚠️
  • Transaction consistency: Good → +10 points ✅
  • Missing invoice data → -5 points ❌

💡 AI Recommendations:
  "Untuk meningkatkan skor Anda ke kategori lebih baik:
   1. Tambahkan data penjualan minimal 6 bulan terakhir
   2. Upload invoice terbaru untuk validasi
   3. Tingkatkan jumlah karyawan atau omzet"

💰 Loan Simulation:
  Requested: 10,000,000 IDR
  Recommended Tenor: 24 months
  Monthly Payment: ~450,000 IDR
  Annual Interest: ~8.5%

[📥 Export as PDF] [↩️ New Scoring]
```

---

## 🤔 FAQ for Judges

**Q: Do I need to install anything?**  
A: Yes, just Git + Node.js + Python (instructions above). No Azure account needed!

**Q: Can I test without entering real data?**  
A: Yes! Click "Demo Mode" at `/demo` for pre-filled example. Or use random test numbers.

**Q: What if the ML model isn't loaded?**  
A: Check `ml/models/` folder. If empty, run `cd ml && python train_model.py` (takes 1 min).

**Q: Can I test document OCR?**  
A: Yes! Upload JPG/PNG invoice. Without Azure keys, it shows placeholder. With keys, actual OCR works.

**Q: How accurate is the credit score?**  
A: For demo purposes, this is a simplified Random Forest model. Production uses larger dataset & more features.

**Q: Can I see the API documentation?**  
A: Yes! Go to http://localhost:8000/docs (Swagger) or http://localhost:8000/redoc (ReDoc).

**Q: Is the database saved?**  
A: Yes! SQLite database at `backend/aksesa.db`. Survives restarts. Delete to reset.

**Q: Can multiple people test at same time?**  
A: Yes! Each gets separate session. Recommended: each person opens in different browser/incognito window.

---

## 📞 Quick Help

**Backend won't start (Python error)?**
```bash
# Reinstall Python dependencies
cd backend
pip install -r requirements.txt

# Then restart backend
python -m uvicorn main:app --reload
```

**Frontend won't load?**
```bash
# Reinstall Node dependencies
cd frontend
npm install

# Then restart frontend
npm run dev
```

**Database errors?**
```bash
# Fresh database
cd backend
rm aksesa.db
# Restart backend → creates new DB
```

**CORS error in browser?**
```bash
# Just means API URL is wrong. Check that backend is running at:
http://localhost:8000
```

**Need more details?**
- Architecture → [README.md](./README.md)
- Deployment (optional) → [DEPLOYMENT.md](./DEPLOYMENT.md)
- Developer docs → [AGENTS.md](./AGENTS.md)

---

## ✅ Quick Evaluation Checklist

After testing locally, verify:

- [ ] **Scoring works** - Form → Results (appears in 2-3 seconds)
- [ ] **Score range** - Shows 0-100 with category badge
- [ ] **AI recommendations** - Text appears (or fallback message)
- [ ] **UI clean** - Professional look, no errors visible
- [ ] **No console errors** - Check browser DevTools → Console
- [ ] **Backend logs clean** - No red errors in terminal

## 📊 Evaluation Score Card

After testing, rate on these criteria:

| Criterion | Rating | Notes |
|-----------|--------|-------|
| **Innovation** (25%) | 🟢🟡🔴 | Alternative data + Explainable AI? |
| **Design & UX** (25%) | 🟢🟡🔴 | Clean interface, easy to use? |
| **AI & Azure** (30%) | 🟢🟡🔴 | ML + LLM working? API clean? |
| **Social Impact** (20%) | 🟢🟡🔴 | Solves real UMKM problem? |

---

<div align="center">

### 🙏 Thank you for evaluating Aksesa!

**Questions?** Check:
- [README.md](./README.md) — Full overview
- [AGENTS.md](./AGENTS.md) — Technical details
- [SUBMISSION_CHECKLIST.md](./SUBMISSION_CHECKLIST.md) — Scoring criteria

**Issues?** Open GitHub issue → we'll help

---

**Made with ❤️ for Indonesian UMKM**

*"Setiap UMKM berhak mendapat akses modal yang adil"*

</div>

---

**Version**: 1.1 (Local Testing Optimized)  
**Last Updated**: 2026-04-27  
**Status**: Ready for Evaluation ✅
