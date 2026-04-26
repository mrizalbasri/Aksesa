# 🤖 AGENTS.md — Aksesa Developer Guide

**Purpose**: Help agents (and humans) avoid mistakes when working in this repo. Only includes high-signal, repo-specific guidance.

---

## 🏗️ Architecture & Structure

**3-layer system**: Frontend (Next.js) → Backend (FastAPI) → ML (scikit-learn)

| Layer | Location | Entry Point | Purpose |
|-------|----------|-------------|---------|
| Frontend | `frontend/` | `pages/` (Next.js routes) | Landing, scoring form, result dashboard |
| Backend | `backend/` | `backend/main.py` | FastAPI server, API routes, services |
| ML | `ml/` | `ml/train_model.py` | Train Random Forest model, save to `ml/models/` |

**Data Flow**:
```
Frontend Form Input → POST /api/v1/scoring → Backend (routes/scoring.py)
   ↓
Backend Services:
  • azure_docintel.py — OCR invoice images
  • ml_service.py — Load model, scale features, predict score
  • azure_openai.py — Generate recommendations (Groq LLM fallback)
   ↓
Backend Database (SQLAlchemy ORM) → Store results
   ↓
Return JSON response → Frontend Dashboard
```

**Critical Boundaries** (do not break):
- `backend/main.py` — App initialization, router includes, CORS, DB lifecycle. Changes here affect startup.
- `backend/services/` — Azure integrations live here. Each service is semi-independent.
- `backend/database/` — ORM models (SQLAlchemy), connection logic, no migrations (uses `create_all()`).
- `frontend/pages/` — Next.js routes. Changes affect routing.
- `frontend/components/ui/` — Shared shadcn/ui primitives. Don't duplicate.

---

## 📋 Commands (Exact Working Directories Matter)

### Frontend Development
```bash
cd frontend && npm install      # Install deps
cd frontend && npm run dev      # Start dev server (http://localhost:3000)
cd frontend && npm run build    # Build production
cd frontend && npm run lint     # Run ESLint
cd frontend && npm run type-check  # TypeScript strict mode check
```

### Backend Development
```bash
cd backend && pip install -r requirements.txt  # Install deps
cd backend && python -m uvicorn main:app --reload  # Start dev server (http://localhost:8000)
```

### ML
```bash
cd ml && pip install -r requirements.txt  # Install deps
cd ml && python train_model.py  # Train model, outputs to ml/models/credit_model.pkl + scaler.pkl
```

### Deployment (Post-Selection)
```bash
cd backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
./scripts/grant-sql-access.sh      # Linux/Mac Azure SQL permissions
./scripts/grant-sql-access.ps1     # Windows Azure SQL permissions
```

**Order Matters**: `install deps → dev server → test changes → lint → type-check → commit`

---

## ⚙️ Environment & Config Gotchas

### Required Variables (from `backend/.env.example`)

**Azure Services** (all required for full functionality):
```
AZURE_OPENAI_API_KEY=<your-key>
AZURE_OPENAI_ENDPOINT=https://<resource>.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o

AZURE_ML_ENDPOINT=<endpoint>
AZURE_ML_KEY=<key>

AZURE_DOC_INTEL_ENDPOINT=<endpoint>
AZURE_DOC_INTEL_KEY=<key>

AZURE_STORAGE_CONNECTION_STRING=<connection-string>
AZURE_STORAGE_CONTAINER=documents
```

**Database** (defaults to SQLite if DB_SQLITE_PATH set):
```
DB_SQLITE_PATH=./aksesa.db        # SQLite (default, local dev)
# OR
AZURE_SQL_SERVER=<server>         # Azure SQL (production)
AZURE_SQL_DATABASE=Aksesa_db
AZURE_SQL_USER=<user>
AZURE_SQL_PASSWORD=<password>
```

**Auth & Security**:
```
SECRET_KEY=your-super-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**CORS & Frontend**:
```
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:8000,https://yourdomain.com
```

**Optional**:
```
GOOGLE_CLIENT_ID=<optional>
DEBUG=true  (defaults to true)
```

### Setup Checklist
- [ ] Copy `backend/.env.example` → `backend/.env`
- [ ] Fill in Azure keys (or comment out Azure services for local-only testing)
- [ ] Run `cd backend && pip install -r requirements.txt`
- [ ] Run `cd ml && python train_model.py` (generates models)
- [ ] Check `ml/models/credit_model.pkl` and `scaler.pkl` exist (required for scoring)
- [ ] Set `ALLOWED_ORIGINS` to match frontend URLs
- [ ] Test: `cd backend && python -m uvicorn main:app --reload`

### Common Breakage Points
1. **Missing `.env` file** → Backend fails on startup (ImportError)
2. **Model files not generated** → Scoring endpoint returns 500 (MODEL_NOT_FOUND)
3. **CORS misconfiguration** → Frontend API calls fail (CORS error in browser)
4. **JWT SECRET_KEY mismatch** → Auth tokens invalid
5. **Azure keys invalid** → Async fallback to Groq LLM (if configured)

---

## 🎨 Code Conventions

### Frontend (TypeScript + Next.js)

**Import Aliases** (tsconfig.json):
```typescript
import Navbar from "@/components/Navbar";          // Not: ../components/Navbar
import { Button } from "@/components/ui/button";   // shadcn/ui primitives
import { useAuth } from "@/lib/auth";              // Utilities in lib/
```

**Form Validation** (react-hook-form + Zod):
```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define schema in @/lib/validators.ts or component-local
const schema = z.object({
  transactions: z.array(z.number()).min(1),
  business_name: z.string().min(1)
});

const { control, handleSubmit } = useForm({
  resolver: zodResolver(schema),
  defaultValues: {}
});
```

**UI Components** (shadcn/ui pattern):
- Import from `@/components/ui/` (Button, Card, Input, Dialog, etc.)
- Use Tailwind utility classes, no custom CSS
- Existing: Button, Card, Input, Dialog, Navbar, Footer

**Error Handling**:
```typescript
try {
  const response = await requestJson(url, options);
  return response;
} catch (error) {
  if (error instanceof ApiError) {
    console.error(error.message); // "Request failed: 500"
  }
}
```

**Auth Pattern** (sessionStorage + Bearer):
```typescript
// Frontend stores JWT in sessionStorage
sessionStorage.setItem("token", response.access_token);

// API calls include Bearer token
const headers = { Authorization: `Bearer ${token}` };
```

**API Response Interface**:
```typescript
interface ScoringResponsePayload {
  score: number;           // 0-100
  risk_category: string;   // "High Risk" | "Medium Risk" | "Creditworthy"
  factors: Array<{ name: string; value: number; contribution: number }>;
  recommendations: string;
  pdf_url?: string;
}
```

---

### Backend (Python + FastAPI)

**Project Structure**:
```
backend/
├── main.py                 # FastAPI app, routers, CORS, DB init
├── routes/
│   ├── auth.py            # POST /auth/login, /auth/register, /auth/me
│   ├── scoring.py         # POST /scoring, /documents/ocr
│   └── results.py         # GET /results/{id}
├── services/
│   ├── ml_service.py      # Load model, predict, scale features
│   ├── azure_openai.py    # Call Azure OpenAI for recommendations
│   ├── azure_docintel.py  # OCR via Azure Document Intelligence
│   └── auth_service.py    # JWT token creation/validation
├── database/
│   ├── models.py          # SQLAlchemy ORM models
│   ├── dependencies.py    # get_db() dependency
│   └── repositories.py    # Data access layer (get_user, save_result, etc.)
└── schemas/
    ├── auth.py            # Pydantic schemas for auth endpoints
    ├── scoring.py         # Pydantic schemas for scoring requests/responses
    └── common.py          # ErrorResponse, common types
```

**Error Handling**:
```python
# Define custom exception
class ServiceError(Exception):
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code

# Register exception handler in main.py
@app.exception_handler(ServiceError)
async def service_error_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.message}
    )

# Raise in routes
if not user:
    raise ServiceError("User not found", status_code=404)
```

**Auth Middleware** (Dependency Injection):
```python
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthCredentials

def get_current_user(credentials: HTTPAuthCredentials = Depends(HTTPBearer())) -> AuthUser:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        return AuthUser(id=user_id, email=payload.get("email"))
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/protected-endpoint")
async def protected(user: AuthUser = Depends(get_current_user)):
    return {"user_id": user.id}
```

**Pydantic Schema Example**:
```python
from pydantic import BaseModel, Field

class ScoringRequest(BaseModel):
    transactions: list[float]
    business_name: str
    business_years: int = Field(gt=0)
    num_employees: int = Field(ge=0)

class ScoringResponse(BaseModel):
    score: float  # 0-100
    risk_category: str
    factors: list[dict]
    recommendations: str
```

**ML Model Loading** (ml_service.py):
```python
import pickle
from pathlib import Path

MODEL_PATH = Path("ml/models/credit_model.pkl")
SCALER_PATH = Path("ml/models/scaler.pkl")

def load_model():
    if not MODEL_PATH.exists():
        raise ServiceError("Model file not found", status_code=500)
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
    return model

def predict_score(features: list[float]) -> float:
    model = load_model()
    scaler = load_scaler()
    scaled_features = scaler.transform([features])
    score = model.predict_proba(scaled_features)[0][1] * 100
    return round(score, 2)
```

**Database (SQLAlchemy)** — No migrations, uses create_all():
```python
# backend/database/models.py
from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String(255), unique=True)
    hashed_password = Column(String(255))

class ScoringResult(Base):
    __tablename__ = "scoring_results"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    score = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

# App startup (main.py)
Base.metadata.create_all(bind=engine)
```

---

## ✅ Pre-Commit Checklist

Before committing code changes:

### Frontend Changes
```bash
cd frontend && npm run lint      # ESLint must pass
cd frontend && npm run type-check # TypeScript strict must pass
cd frontend && npm run build     # Build must succeed
```

### Backend Changes
```bash
cd backend && python -m uvicorn main:app --reload  # Must start without errors
cd backend && python -m py_compile routes/*.py services/*.py  # Syntax check
```

### Both
```bash
git diff --cached                # Review changes before committing
git log --oneline -3             # Check recent commits follow convention
```

---

## 🚀 Deployment Notes (Post-Selection)

- **Docker**: Frontend and backend each have Dockerfile; `azure.yaml` orchestrates build + post-provision hooks.
- **Azure SQL**: Requires `grant-sql-access.sh` or `.ps1` script to grant app identity permissions.
- **Models**: ML models must be committed to `ml/models/` or injected at runtime (currently committed).
- **Secrets**: `.env` variables must be set in Azure App Service config (never committed).
- **CORS**: Update `ALLOWED_ORIGINS` in Azure App Service config for production URLs.

---

## 🛑 Do Not

- ❌ Use `as any` or `@ts-ignore` in frontend TypeScript
- ❌ Modify `backend/main.py` routers without testing API startup
- ❌ Delete `ml/models/` files without regenerating
- ❌ Hard-code secrets in code (use `.env` always)
- ❌ Change database connection logic without testing ORM startup
- ❌ Add new dependencies without updating `requirements.txt` or `package.json`

---

## 📞 Quick Reference

| Need | Command | Location |
|------|---------|----------|
| Start all services | See "Commands" section | — |
| Check types | `cd frontend && npm run type-check` | `frontend/` |
| Format code | ESLint (`cd frontend && npm run lint`) | `frontend/` |
| Train ML model | `cd ml && python train_model.py` | `ml/` |
| View API docs | http://localhost:8000/docs | Swagger (FastAPI) |
| Review environment | `cat backend/.env.example` | `backend/` |
| Check git status | `git status` | Root |

---

**Last Updated**: 2026-04-26 | **Status**: Demo-Ready ✅
