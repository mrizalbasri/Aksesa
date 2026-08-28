# 🚀 Aksesa - Improvement Plan

## 📋 Overview

This document outlines the improvement roadmap for Aksesa, prioritized by urgency and impact. Each phase includes specific tasks, implementation details, and estimated effort.

---

## ✅ PHASE 0: MONETIZATION FEATURES (COMPLETED)

**Priority:** 🟢 **COMPLETED** - Free credits system implemented  
**Estimated Time:** 6-8 hours  
**Actual Time:** ~6 hours  
**Impact:** Enables user acquisition and monetization strategy

### 0.1 Free Credits System ✅

**Implementation Date:** 2026-06-06

**Features Implemented:**

1. **Database Schema** (`backend/database/models.py`)
   - Added `SubscriptionTier` enum (FREE, BASIC, PREMIUM)
   - Added credits fields to User model:
     - `free_credits` (default: 5 welcome bonus)
     - `premium_credits` (default: 0)
     - `subscription_tier` (default: FREE)
     - `last_credit_reset` (for daily reset tracking)
   - Created `CreditTransaction` model for audit trail
   - Created `CreditAction` enum (SCORING, OCR, SIMULATION, BONUS, PURCHASE)

2. **Credit Service** (`backend/services/credit_service.py`)
   - `check_and_deduct_credits()` - Validates and deducts credits before actions
   - `grant_welcome_bonus()` - Gives 5 free credits to new users
   - `get_user_credits()` - Returns current credit balance and subscription info
   - `get_credit_history()` - Returns paginated transaction history
   - `upgrade_subscription()` - Handles subscription tier upgrades
   - Daily credit reset mechanism (3 credits/day for free tier)
   - Premium users get unlimited credits (no deduction)

3. **API Endpoints** (`backend/routes/credits.py`)
   - `GET /api/v1/credits/balance` - Get user's credit balance
   - `GET /api/v1/credits/history` - Get credit transaction history
   - `POST /api/v1/credits/upgrade` - Upgrade subscription tier

4. **Integration Points**
   - Updated `auth_service.py` - Grants welcome bonus on user registration
   - Updated `scoring.py` - Checks and deducts credits before scoring
   - Updated `main.py` - Registered credits router

5. **Frontend Components** (`frontend/components/CreditsDisplay.tsx`)
   - `CreditsDisplay` - Shows credit badge in navbar with real-time balance
   - `CreditsWarning` - Warning banner when credits are low (≤1)
   - `WelcomeBonusBanner` - Welcome message for new users with bonus info

6. **Frontend Integration**
   - Updated `Navbar.tsx` - Added CreditsDisplay component
   - Updated `lib/api.ts` - Added credits API client functions

**Credit Costs:**
- Scoring: 1 credit per request
- OCR: 1 credit per document
- Loan Simulation: FREE (0 credits)

**Subscription Tiers:**
- **FREE**: 5 credits welcome bonus + 3 credits/day (resets every 24h)
- **BASIC**: 50 credits/month (planned)
- **PREMIUM**: Unlimited credits

**Files Created:**
- `backend/services/credit_service.py` (270 lines)
- `backend/routes/credits.py` (150 lines)
- `frontend/components/CreditsDisplay.tsx` (250 lines)

**Files Modified:**
- `backend/database/models.py` (added 2 models, 1 enum)
- `backend/services/auth_service.py` (added welcome bonus call)
- `backend/routes/scoring.py` (added credit check)
- `backend/main.py` (registered credits router)
- `frontend/lib/api.ts` (added 3 API functions)
- `frontend/components/Navbar.tsx` (added credits display)

**Testing Required:**
- [ ] Test user registration → verify 5 credits granted
- [ ] Test scoring → verify credit deduction
- [ ] Test daily reset → verify 3 credits after 24h
- [ ] Test premium upgrade → verify unlimited access
- [ ] Test credit history → verify transaction logging
- [ ] Test insufficient credits → verify error handling

**Future Enhancements:**
- Payment integration (Midtrans/Xendit)
- Email notifications for low credits
- Credit purchase packages
- Referral bonus system
- Monthly subscription billing

---



## 🚨 PHASE 1: CRITICAL SECURITY FIXES (URGENT)

**Priority:** 🔴 **CRITICAL** - Must be completed before production deployment  
**Estimated Time:** 4-6 hours  
**Impact:** Prevents major security vulnerabilities

### 1.1 Implement Password Hashing

**Current Issue:**
```python
# backend/services/auth_service.py (line 88-89)
# Password stored in plain text - CRITICAL SECURITY RISK
user = await create_user(
    db=db,
    email=email,
    name=name,
    # TODO: Password hashing not implemented
)
```

**Solution:**
```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def register_user(db, email, password, name, ...):
    # Hash password before storing
    hashed_password = pwd_context.hash(password)
    
    user = await create_user(
        db=db,
        email=email,
        name=name,
        hashed_password=hashed_password,  # Store hashed
        ...
    )
    return user

def authenticate_user(email: str, password: str) -> AuthUser:
    # Verify hashed password
    user = get_user_from_db(email)
    if not pwd_context.verify(password, user.hashed_password):
        raise ServiceError("Invalid credentials")
    return user
```

**Files to Modify:**
- `backend/services/auth_service.py`
- `backend/database/models.py` (add hashed_password field)
- `backend/database/repositories.py` (update create_user)

**Effort:** 1 hour

---

### 1.2 Generate Strong JWT Secret Key

**Current Issue:**
```python
# backend/services/auth_service.py (line 28)
def _get_secret_key() -> str:
    return os.getenv("SECRET_KEY", "dev-secret-key-change-me")  # ❌ Weak default
```

**Solution:**
```python
import secrets

# Generate strong secret key (run once)
secret_key = secrets.token_urlsafe(32)
print(f"SECRET_KEY={secret_key}")

# Add to .env
SECRET_KEY=your_generated_strong_secret_key_here_32_chars_minimum
```

**Implementation:**
```python
def _get_secret_key() -> str:
    key = os.getenv("SECRET_KEY")
    if not key or key == "dev-secret-key-change-me":
        raise ValueError(
            "SECRET_KEY must be set in environment variables. "
            "Generate with: python -c 'import secrets; print(secrets.token_urlsafe(32))'"
        )
    return key
```

**Files to Modify:**
- `backend/services/auth_service.py`
- `backend/.env.example` (add note about generating key)

**Effort:** 30 minutes

---

### 1.3 Add Password Validation

**Current Issue:**
- No validation on password strength
- Users can set weak passwords like "123"

**Solution:**
```python
# backend/schemas/auth.py
import re
from pydantic import field_validator

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one number')
        return v
```

**Files to Modify:**
- `backend/schemas/auth.py`

**Effort:** 30 minutes

---

### 1.4 Fix Silent Database Initialization

**Current Issue:**
```python
# backend/main.py (line 51-54)
@app.on_event("startup")
async def startup_event():
    try:
        await init_db()
    except Exception:
        pass  # ❌ Silently ignores errors
```

**Solution:**
```python
import logging

logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    try:
        await init_db()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")
        raise  # Re-raise to prevent app from starting with broken DB
```

**Files to Modify:**
- `backend/main.py`

**Effort:** 15 minutes

---

### 1.5 Implement Proper Database Authentication

**Current Issue:**
```python
# backend/services/auth_service.py (line 62-73)
def authenticate_user(email: str, password: str) -> AuthUser:
    # Only checks demo user, skips DB lookup
    demo_user = _get_demo_user()
    if email == demo_user.email and password == demo_user.password:
        return _to_auth_user(demo_user)
    
    # Skip DB check - registered users can't login!
    raise ServiceError("Invalid credentials")
```

**Solution:**
```python
async def authenticate_user(db: DbSession, email: str, password: str) -> AuthUser:
    # Check demo user first
    demo_user = _get_demo_user()
    if email == demo_user.email:
        if hmac.compare_digest(password, demo_user.password):
            return _to_auth_user(demo_user)
        raise ServiceError("Invalid credentials")
    
    # Check database for registered users
    user = await get_user_by_email(db, email)
    if not user:
        raise ServiceError("Invalid credentials")
    
    # Verify hashed password
    if not pwd_context.verify(password, user.hashed_password):
        raise ServiceError("Invalid credentials")
    
    return AuthUser(
        id=user.id,
        email=user.email,
        name=user.name,
        role=user.role.value
    )
```

**Files to Modify:**
- `backend/services/auth_service.py`
- `backend/routes/auth.py` (pass db session)

**Effort:** 1 hour

---

## ⚠️ PHASE 2: ML MODEL IMPROVEMENTS (HIGH PRIORITY)

**Priority:** 🟠 **HIGH** - Improves core functionality accuracy  
**Estimated Time:** 6-8 hours  
**Impact:** Makes credit scoring more reliable and accurate

### 2.1 Remove Hardcoded Mock Values

**Current Issue:**
```python
# backend/services/ml_service.py (line 42-49)
def extract_features_from_request(payload: ScoringRequest):
    # ❌ Hardcoded mock values
    on_time_ratio = 0.9  # Mock: assume 90% on-time
    late_payment_days = 2  # Mock: assume 2 days average
    revenue_std = monthly_revenue * 0.15  # Mock: 15% std deviation
    revenue_trend = 0.05  # Mock: slight positive trend
```

**Solution:**
```python
def extract_features_from_request(payload: ScoringRequest):
    transactions = payload.transactions
    
    # Calculate real on-time ratio from transaction dates
    on_time_ratio = calculate_on_time_ratio(transactions)
    
    # Calculate real late payment days
    late_payment_days = calculate_avg_late_days(transactions)
    
    # Calculate real revenue stability from transaction history
    revenue_std = calculate_revenue_std(transactions)
    
    # Calculate real revenue trend
    revenue_trend = calculate_revenue_trend(transactions)
    
    return {
        'on_time_ratio': on_time_ratio,
        'late_payment_days': late_payment_days,
        'revenue_std': revenue_std,
        'revenue_trend': revenue_trend,
        ...
    }

def calculate_on_time_ratio(transactions: list) -> float:
    """Calculate percentage of on-time payments from transaction dates"""
    if not transactions:
        return 0.5  # Default neutral value
    
    # Assume payment is on-time if within 30 days of transaction
    on_time_count = 0
    for tx in transactions:
        # Logic to determine if payment was on-time
        # This requires additional payment_date field in transaction
        pass
    
    return on_time_count / len(transactions)

def calculate_revenue_std(transactions: list) -> float:
    """Calculate revenue standard deviation from transaction history"""
    if len(transactions) < 2:
        return 0
    
    amounts = [tx.amount for tx in transactions]
    return np.std(amounts)

def calculate_revenue_trend(transactions: list) -> float:
    """Calculate revenue growth trend from transaction history"""
    if len(transactions) < 2:
        return 0
    
    # Sort by date and calculate linear regression slope
    sorted_tx = sorted(transactions, key=lambda x: x.date)
    amounts = [tx.amount for tx in sorted_tx]
    
    # Simple trend: (last - first) / first
    if amounts[0] == 0:
        return 0
    
    return (amounts[-1] - amounts[0]) / amounts[0]
```

**Files to Modify:**
- `backend/services/ml_service.py`
- `backend/schemas/scoring.py` (add payment_date field if needed)

**Effort:** 2 hours

---

### 2.2 Add Feature Engineering

**Current Features:** 12 basic features  
**Target:** 20+ engineered features for better predictions

**New Features to Add:**
```python
def add_engineered_features(features: dict) -> dict:
    """Add derived features for better model performance"""
    
    # Revenue per employee (productivity metric)
    features['revenue_per_employee'] = (
        features['monthly_revenue'] / max(features['num_employees'], 1)
    )
    
    # Transaction frequency (transactions per day)
    features['transaction_frequency'] = features['transaction_count'] / 30
    
    # Average transaction size
    features['avg_transaction_size'] = (
        features['monthly_revenue'] / max(features['transaction_count'], 1)
    )
    
    # Business maturity score (0-1)
    features['business_maturity'] = min(features['business_age_years'] / 10, 1.0)
    
    # Revenue consistency (inverse of std/mean)
    if features['monthly_revenue'] > 0:
        features['revenue_consistency'] = 1 - (
            features['revenue_std'] / features['monthly_revenue']
        )
    else:
        features['revenue_consistency'] = 0
    
    # Payment reliability score
    features['payment_reliability'] = (
        features['on_time_ratio'] * 0.7 + 
        (1 - min(features['late_payment_days'] / 30, 1)) * 0.3
    )
    
    # Digital presence score
    features['digital_presence'] = (
        features['has_marketplace'] * 0.5 + 
        features['marketplace_sales_ratio'] * 0.5
    )
    
    # Growth potential
    features['growth_potential'] = (
        features['revenue_trend'] * 0.4 +
        features['business_maturity'] * 0.3 +
        features['digital_presence'] * 0.3
    )
    
    return features
```

**Files to Modify:**
- `backend/services/ml_service.py`
- `ml/train_model.py` (update training with new features)

**Effort:** 2 hours

---

### 2.3 Try XGBoost Model

**Why XGBoost?**
- Better performance on tabular data
- Built-in feature importance
- Handles missing values
- Faster training than RandomForest

**Implementation:**
```python
# ml/train_model.py
from xgboost import XGBRegressor
from sklearn.model_selection import cross_val_score

def train_xgboost_model():
    """Train XGBoost model for credit scoring"""
    
    # XGBoost model
    xgb_model = XGBRegressor(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42
    )
    
    # Train
    xgb_model.fit(X_train_scaled, y_train)
    
    # Evaluate
    y_pred = xgb_model.predict(X_test_scaled)
    
    # Cross-validation
    cv_scores = cross_val_score(
        xgb_model, X_train_scaled, y_train, 
        cv=5, scoring='neg_mean_squared_error'
    )
    
    print(f"CV RMSE: {np.sqrt(-cv_scores.mean()):.2f}")
    
    # Compare with RandomForest
    rf_model = RandomForestClassifier(...)
    rf_model.fit(X_train_scaled, y_train)
    
    # Save best model
    if xgb_better_than_rf:
        joblib.dump(xgb_model, 'credit_model.pkl')
    
    return xgb_model
```

**Dependencies to Add:**
```txt
# backend/requirements.txt
xgboost==2.0.3
```

**Files to Modify:**
- `ml/train_model.py`
- `backend/requirements.txt`

**Effort:** 2 hours

---

### 2.4 Implement Model Validation

**Add Model Performance Tracking:**
```python
# backend/services/ml_service.py
import json
from datetime import datetime

def log_prediction(features: dict, prediction: int, actual: int = None):
    """Log predictions for monitoring model performance"""
    log_entry = {
        'timestamp': datetime.utcnow().isoformat(),
        'features': features,
        'prediction': prediction,
        'actual': actual,  # If available (for validation)
    }
    
    # Append to log file
    with open('ml/logs/predictions.jsonl', 'a') as f:
        f.write(json.dumps(log_entry) + '\n')

def calculate_model_metrics():
    """Calculate model performance metrics from logs"""
    predictions = []
    actuals = []
    
    with open('ml/logs/predictions.jsonl', 'r') as f:
        for line in f:
            entry = json.loads(line)
            if entry.get('actual'):
                predictions.append(entry['prediction'])
                actuals.append(entry['actual'])
    
    if len(predictions) > 0:
        from sklearn.metrics import mean_squared_error, r2_score
        mse = mean_squared_error(actuals, predictions)
        r2 = r2_score(actuals, predictions)
        
        return {
            'mse': mse,
            'rmse': np.sqrt(mse),
            'r2': r2,
            'sample_size': len(predictions)
        }
    
    return None
```

**Files to Create:**
- `ml/logs/predictions.jsonl`
- `backend/services/ml_monitoring.py`

**Effort:** 2 hours

---

## 📋 PHASE 3: CODE QUALITY & STABILITY (MEDIUM PRIORITY)

**Priority:** 🟡 **MEDIUM** - Improves maintainability and reliability  
**Estimated Time:** 8-10 hours  
**Impact:** Better debugging, monitoring, and error handling

### 3.1 Add Structured Logging

**Install Loguru:**
```bash
pip install loguru
```

**Implementation:**
```python
# backend/services/logger.py
from loguru import logger
import sys

# Configure logger
logger.remove()  # Remove default handler
logger.add(
    sys.stdout,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
    level="INFO"
)

# Add file handler
logger.add(
    "logs/aksesa_{time:YYYY-MM-DD}.log",
    rotation="1 day",
    retention="30 days",
    level="DEBUG"
)

# Usage in services
from services.logger import logger

def predict_credit_score(payload):
    logger.info(f"Predicting score for user: {payload.businessAge} years old")
    try:
        score = model.predict(...)
        logger.success(f"Prediction successful: score={score}")
        return score
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise
```

**Files to Modify:**
- All service files in `backend/services/`
- `backend/main.py`
- `backend/requirements.txt`

**Effort:** 2 hours

---

### 3.2 Implement Rate Limiting

**Install SlowAPI:**
```bash
pip install slowapi
```

**Implementation:**
```python
# backend/main.py
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Apply to auth endpoints
@router.post("/auth/login")
@limiter.limit("5/minute")  # Max 5 login attempts per minute
async def login(request: Request, payload: LoginRequest):
    ...

@router.post("/auth/register")
@limiter.limit("3/hour")  # Max 3 registrations per hour
async def register(request: Request, payload: RegisterRequest):
    ...

@router.post("/api/v1/scoring")
@limiter.limit("10/minute")  # Max 10 scoring requests per minute
async def calculate_score(request: Request, payload: ScoringRequest):
    ...
```

**Files to Modify:**
- `backend/main.py`
- `backend/routes/auth.py`
- `backend/routes/scoring.py`
- `backend/requirements.txt`

**Effort:** 1 hour

---

### 3.3 Add Comprehensive Input Validation

**Current Issue:**
- No validation on business_age (could be negative)
- No validation on employees (could be 0 or negative)
- No validation on amounts (could be negative)

**Solution:**
```python
# backend/schemas/scoring.py
from pydantic import BaseModel, Field, field_validator

class ScoringRequest(BaseModel):
    transactions: list[TransactionItem] = Field(
        ..., 
        min_length=1, 
        max_length=100,
        description="List of transactions (1-100 items)"
    )
    tokopedia: float = Field(
        ge=0, 
        le=1_000_000_000,
        description="Tokopedia sales in IDR"
    )
    shopee: float = Field(
        ge=0, 
        le=1_000_000_000,
        description="Shopee sales in IDR"
    )
    businessAge: int = Field(
        ge=0, 
        le=100,
        description="Business age in years (0-100)"
    )
    employees: int = Field(
        ge=1, 
        le=10000,
        description="Number of employees (1-10000)"
    )
    location: str = Field(
        min_length=1,
        max_length=200,
        description="Business location"
    )
    
    @field_validator('transactions')
    @classmethod
    def validate_transactions(cls, v):
        if not v:
            raise ValueError('At least one transaction is required')
        
        total_amount = sum(tx.amount for tx in v)
        if total_amount <= 0:
            raise ValueError('Total transaction amount must be positive')
        
        return v

class TransactionItem(BaseModel):
    date: str = Field(
        pattern=r'^\d{4}-\d{2}-\d{2}$',
        description="Transaction date in YYYY-MM-DD format"
    )
    amount: float = Field(
        gt=0,
        le=1_000_000_000,
        description="Transaction amount in IDR (must be positive)"
    )
```

**Files to Modify:**
- `backend/schemas/scoring.py`
- `backend/schemas/auth.py`

**Effort:** 1 hour

---

### 3.4 Setup Alembic for Database Migrations

**Install Alembic:**
```bash
cd backend
pip install alembic
alembic init alembic
```

**Configure:**
```python
# backend/alembic/env.py
from database import Base
from database.models import User, ScoringResult, Transaction, Document

target_metadata = Base.metadata

# backend/alembic.ini
sqlalchemy.url = sqlite:///./aksesa.db
```

**Create Initial Migration:**
```bash
alembic revision --autogenerate -m "Initial schema"
alembic upgrade head
```

**Files to Create:**
- `backend/alembic/` directory
- `backend/alembic/versions/` directory

**Effort:** 2 hours

---

### 3.5 Add Error Boundaries in React

**Implementation:**
```typescript
// frontend/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// frontend/pages/_app.tsx
import ErrorBoundary from '../components/ErrorBoundary';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}
```

**Files to Create:**
- `frontend/components/ErrorBoundary.tsx`

**Files to Modify:**
- `frontend/pages/_app.tsx`

**Effort:** 1 hour

---

### 3.6 Implement Loading States

**Implementation:**
```typescript
// frontend/components/scoring/ScoringFormProvider.tsx
import { useState } from 'react';

export function ScoringFormProvider() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: ScoringData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await submitScoring(data);
      // Handle success
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading && <LoadingSpinner />}
      {error && <ErrorAlert message={error} />}
      <ScoringForm onSubmit={handleSubmit} disabled={isLoading} />
    </div>
  );
}

// frontend/components/LoadingSpinner.tsx
export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-700">Processing your request...</p>
      </div>
    </div>
  );
}
```

**Files to Create:**
- `frontend/components/LoadingSpinner.tsx`
- `frontend/components/ErrorAlert.tsx`

**Files to Modify:**
- `frontend/components/scoring/ScoringFormProvider.tsx`

**Effort:** 1 hour

---

## 🧪 PHASE 4: TESTING & DOCUMENTATION (MEDIUM PRIORITY)

**Priority:** 🟡 **MEDIUM** - Ensures reliability and maintainability  
**Estimated Time:** 10-12 hours  
**Impact:** Prevents bugs, easier onboarding

### 4.1 Add Backend Unit Tests

**Install Pytest:**
```bash
cd backend
pip install pytest pytest-asyncio pytest-cov httpx
```

**Create Test Structure:**
```
backend/
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_auth_service.py
│   ├── test_ml_service.py
│   ├── test_scoring_routes.py
│   └── test_database.py
```

**Example Tests:**
```python
# backend/tests/test_ml_service.py
import pytest
from services.ml_service import predict_credit_score, extract_features_from_request
from schemas.scoring import ScoringRequest, TransactionItem

def test_predict_credit_score_valid_input():
    """Test credit score prediction with valid input"""
    payload = ScoringRequest(
        transactions=[
            TransactionItem(date="2024-01-01", amount=1000000),
            TransactionItem(date="2024-01-02", amount=1500000),
        ],
        tokopedia=5000000,
        shopee=3000000,
        businessAge=5,
        employees=10,
        location="Jakarta"
    )
    
    score, features = predict_credit_score(payload)
    
    assert 0 <= score <= 100
    assert isinstance(features, dict)
    assert 'monthly_revenue' in features

def test_extract_features_from_request():
    """Test feature extraction from request"""
    payload = ScoringRequest(...)
    features = extract_features_from_request(payload)
    
    assert features['business_age_years'] == 5
    assert features['num_employees'] == 10
    assert features['transaction_count'] == 2

# backend/tests/test_auth_service.py
import pytest
from services.auth_service import authenticate_user, create_access_token
from services.errors import ServiceError

@pytest.mark.asyncio
async def test_authenticate_demo_user():
    """Test demo user authentication"""
    user = authenticate_user("demo@aksesa.id", "Aksesa123!")
    assert user.email == "demo@aksesa.id"
    assert user.role == "demo"

@pytest.mark.asyncio
async def test_authenticate_invalid_credentials():
    """Test authentication with invalid credentials"""
    with pytest.raises(ServiceError) as exc:
        authenticate_user("demo@aksesa.id", "wrong_password")
    assert exc.value.code == "INVALID_CREDENTIALS"

def test_create_access_token():
    """Test JWT token creation"""
    from services.auth_service import AuthUser
    user = AuthUser(id="123", email="test@test.com", name="Test", role="user")
    token, expires_in = create_access_token(user)
    
    assert isinstance(token, str)
    assert expires_in > 0
```

**Run Tests:**
```bash
cd backend
pytest tests/ -v --cov=services --cov=routes
```

**Files to Create:**
- All test files in `backend/tests/`

**Effort:** 4 hours

---

### 4.2 Add Integration Tests

**Example Integration Test:**
```python
# backend/tests/test_api_integration.py
import pytest
from httpx import AsyncClient
from main import app

@pytest.mark.asyncio
async def test_scoring_endpoint_integration():
    """Test full scoring flow"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Test scoring without auth (should work)
        response = await client.post("/api/v1/scoring", json={
            "transactions": [
                {"date": "2024-01-01", "amount": 1000000}
            ],
            "tokopedia": 5000000,
            "shopee": 3000000,
            "businessAge": 5,
            "employees": 10,
            "location": "Jakarta"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert "score" in data
        assert "risk_category" in data
        assert 0 <= data["score"] <= 100

@pytest.mark.asyncio
async def test_auth_flow_integration():
    """Test registration and login flow"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Register
        register_response = await client.post("/api/v1/auth/register", json={
            "email": "test@example.com",
            "password": "Test123!",
            "name": "Test User"
        })
        assert register_response.status_code == 200
        
        # Login
        login_response = await client.post("/api/v1/auth/login", json={
            "email": "test@example.com",
            "password": "Test123!"
        })
        assert login_response.status_code == 200
        token = login_response.json()["access_token"]
        
        # Access protected endpoint
        me_response = await client.get(
            "/api/v1/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert me_response.status_code == 200
```

**Files to Create:**
- `backend/tests/test_api_integration.py`

**Effort:** 3 hours

---

### 4.3 Add Frontend Component Tests

**Install Testing Libraries:**
```bash
cd frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

**Example Tests:**
```typescript
// frontend/__tests__/components/ScoreGauge.test.tsx
import { render, screen } from '@testing-library/react';
import ScoreGauge from '../../components/scoring/ScoreGauge';

describe('ScoreGauge', () => {
  it('renders score correctly', () => {
    render(<ScoreGauge score={75} />);
    expect(screen.getByText('75')).toBeInTheDocument();
    expect(screen.getByText('Layak Kredit')).toBeInTheDocument();
  });

  it('shows correct risk category for low score', () => {
    render(<ScoreGauge score={30} />);
    expect(screen.getByText('Risiko Tinggi')).toBeInTheDocument();
  });

  it('shows correct risk category for medium score', () => {
    render(<ScoreGauge score={60} />);
    expect(screen.getByText('Risiko Sedang')).toBeInTheDocument();
  });
});
```

**Files to Create:**
- `frontend/__tests__/` directory
- Test files for key components

**Effort:** 3 hours

---

### 4.4 Update API Documentation

**Add Request/Response Examples:**
```python
# backend/routes/scoring.py
@router.post(
    "/scoring",
    response_model=ScoringResponse,
    summary="Calculate Credit Score",
    description="""
    Calculate credit score for UMKM based on transaction data and business profile.
    
    **Example Request:**
    ```json
    {
      "transactions": [
        {"date": "2024-01-01", "amount": 1000000},
        {"date": "2024-01-02", "amount": 1500000}
      ],
      "tokopedia": 5000000,
      "shopee": 3000000,
      "businessAge": 5,
      "employees": 10,
      "location": "Jakarta"
    }
    ```
    
    **Example Response:**
    ```json
    {
      "score": 75,
      "risk_category": "eligible",
      "factors": [
        "Rata-rata transaksi stabil",
        "Terdapat penjualan marketplace"
      ],
      "recommendations": [
        "Tingkatkan frekuensi transaksi",
        "Diversifikasi channel penjualan"
      ]
    }
    ```
    """,
    responses={
        200: {"description": "Successful scoring"},
        400: {"description": "Invalid input data"},
        500: {"description": "Internal server error"}
    }
)
async def calculate_score(...):
    ...
```

**Files to Modify:**
- All route files in `backend/routes/`

**Effort:** 2 hours

---

## 🚀 PHASE 5: PRODUCTION READINESS (NICE TO HAVE)

**Priority:** 🟢 **LOW** - Optimization and scaling  
**Estimated Time:** 12-15 hours  
**Impact:** Better performance and scalability

### 5.1 Implement Caching for ML Predictions

**Install Redis:**
```bash
pip install redis
```

**Implementation:**
```python
# backend/services/cache.py
import redis
import json
import hashlib

redis_client = redis.Redis(
    host='localhost',
    port=6379,
    db=0,
    decode_responses=True
)

def get_cache_key(payload: dict) -> str:
    """Generate cache key from payload"""
    payload_str = json.dumps(payload, sort_keys=True)
    return f"score:{hashlib.md5(payload_str.encode()).hexdigest()}"

def get_cached_score(payload: dict) -> dict | None:
    """Get cached score if available"""
    key = get_cache_key(payload)
    cached = redis_client.get(key)
    if cached:
        return json.loads(cached)
    return None

def cache_score(payload: dict, result: dict, ttl: int = 3600):
    """Cache score result for 1 hour"""
    key = get_cache_key(payload)
    redis_client.setex(key, ttl, json.dumps(result))

# Usage in scoring route
@router.post("/scoring")
async def calculate_score(payload: ScoringRequest):
    # Check cache first
    cached = get_cached_score(payload.dict())
    if cached:
        return cached
    
    # Calculate score
    score, features = predict_credit_score(payload)
    result = {...}
    
    # Cache result
    cache_score(payload.dict(), result)
    
    return result
```

**Files to Create:**
- `backend/services/cache.py`

**Effort:** 2 hours

---

### 5.2 Add Health Check Endpoints

**Implementation:**
```python
# backend/routes/health.py
from fastapi import APIRouter
from database import get_engine
from services.ml_service import load_model_and_scaler

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("/")
async def health_check():
    """Basic health check"""
    return {"status": "healthy"}

@router.get("/ready")
async def readiness_check():
    """Check if all dependencies are ready"""
    checks = {
        "database": False,
        "ml_model": False,
        "azure_openai": False
    }
    
    # Check database
    try:
        engine = get_engine()
        async with engine.connect() as conn:
            await conn.execute("SELECT 1")
        checks["database"] = True
    except Exception:
        pass
    
    # Check ML model
    try:
        load_model_and_scaler()
        checks["ml_model"] = True
    except Exception:
        pass
    
    # Check Azure OpenAI
    try:
        # Ping Azure OpenAI
        checks["azure_openai"] = True
    except Exception:
        pass
    
    all_ready = all(checks.values())
    status_code = 200 if all_ready else 503
    
    return {
        "status": "ready" if all_ready else "not_ready",
        "checks": checks
    }, status_code
```

**Files to Create:**
- `backend/routes/health.py`

**Effort:** 1 hour

---

### 5.3 Setup Monitoring with Azure Application Insights

**Install SDK:**
```bash
pip install opencensus-ext-azure
```

**Implementation:**
```python
# backend/main.py
from opencensus.ext.azure.log_exporter import AzureLogHandler
import logging

# Configure Application Insights
logger = logging.getLogger(__name__)
logger.addHandler(AzureLogHandler(
    connection_string=os.getenv('APPLICATIONINSIGHTS_CONNECTION_STRING')
))

# Track custom metrics
from opencensus.ext.azure import metrics_exporter
from opencensus.stats import aggregation as aggregation_module
from opencensus.stats import measure as measure_module
from opencensus.stats import stats as stats_module
from opencensus.stats import view as view_module

# Define metrics
scoring_requests = measure_module.MeasureInt(
    "scoring_requests",
    "Number of scoring requests",
    "requests"
)

# Track in endpoint
@router.post("/scoring")
async def calculate_score(payload: ScoringRequest):
    # Track metric
    stats = stats_module.stats
    mmap = stats.stats_recorder.new_measurement_map()
    mmap.measure_int_put(scoring_requests, 1)
    mmap.record()
    
    # Process request
    ...
```

**Files to Modify:**
- `backend/main.py`
- `backend/requirements.txt`

**Effort:** 3 hours

---

### 5.4 Optimize Database Queries

**Add Indexes:**
```python
# backend/database/models.py
from sqlalchemy import Index

class User(Base):
    __tablename__ = "users"
    
    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    
    # Add composite index for common queries
    __table_args__ = (
        Index('idx_user_email_role', 'email', 'role'),
    )

class ScoringResult(Base):
    __tablename__ = "scoring_results"
    
    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(80), ForeignKey("users.id"), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, index=True)
    
    # Add composite index
    __table_args__ = (
        Index('idx_scoring_user_created', 'user_id', 'created_at'),
    )
```

**Optimize Queries:**
```python
# backend/database/repositories.py
from sqlalchemy import select
from sqlalchemy.orm import selectinload

async def get_user_scoring_history(db, user_id, limit=20, offset=0):
    """Get user scoring history with optimized query"""
    # Use selectinload to avoid N+1 queries
    stmt = (
        select(ScoringResult)
        .where(ScoringResult.user_id == user_id)
        .options(selectinload(ScoringResult.transactions))
        .order_by(ScoringResult.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    
    result = await db.execute(stmt)
    return result.scalars().all()
```

**Files to Modify:**
- `backend/database/models.py`
- `backend/database/repositories.py`

**Effort:** 2 hours

---

### 5.5 Add Background Task Processing

**Install Celery:**
```bash
pip install celery redis
```

**Implementation:**
```python
# backend/tasks/celery_app.py
from celery import Celery

celery_app = Celery(
    'aksesa',
    broker='redis://localhost:6379/0',
    backend='redis://localhost:6379/0'
)

@celery_app.task
def process_ocr_async(file_bytes: bytes, user_id: str):
    """Process OCR in background"""
    from services.azure_docintel import extract_text_only
    
    extracted_text = extract_text_only(file_bytes)
    
    # Save to database
    # Notify user via websocket/email
    
    return extracted_text

# Usage in route
@router.post("/documents/ocr")
async def process_document(file: UploadFile):
    content = await file.read()
    
    # Queue task
    task = process_ocr_async.delay(content, user.id)
    
    return {
        "task_id": task.id,
        "status": "processing"
    }

@router.get("/documents/ocr/{task_id}")
async def get_ocr_status(task_id: str):
    """Check OCR task status"""
    task = celery_app.AsyncResult(task_id)
    
    return {
        "task_id": task_id,
        "status": task.state,
        "result": task.result if task.ready() else None
    }
```

**Files to Create:**
- `backend/tasks/celery_app.py`
- `backend/tasks/ocr_tasks.py`

**Effort:** 4 hours

---

### 5.6 Update Dependencies

**Check Outdated Packages:**
```bash
# Backend
cd backend
pip list --outdated

# Frontend
cd frontend
npm outdated
```

**Update:**
```bash
# Backend
pip install --upgrade fastapi uvicorn pydantic sqlalchemy

# Frontend
npm update next react react-dom
```

**Test After Update:**
```bash
# Backend
pytest tests/

# Frontend
npm run build
npm run type-check
```

**Effort:** 2 hours

---

## 📊 SUMMARY

### Total Estimated Effort: **46-59 hours**

| Phase | Priority | Time | Tasks | Status |
|-------|----------|------|-------|--------|
| Phase 0: Monetization | 🟢 Completed | 6-8h | 1 task | ✅ DONE |
| Phase 1: Security | 🔴 Critical | 4-6h | 5 tasks | ⏳ Pending |
| Phase 2: ML Model | 🟠 High | 6-8h | 4 tasks | ⏳ Pending |
| Phase 3: Code Quality | 🟡 Medium | 8-10h | 6 tasks | ⏳ Pending |
| Phase 4: Testing | 🟡 Medium | 10-12h | 4 tasks | ⏳ Pending |
| Phase 5: Production | 🟢 Low | 12-15h | 6 tasks | ⏳ Pending |

### Recommended Implementation Order:

1. **Week 1:** Phase 1 (Security) - MUST DO before any deployment
2. **Week 2:** Phase 2 (ML Model) - Improves core functionality
3. **Week 3:** Phase 3 (Code Quality) - Makes codebase maintainable
4. **Week 4:** Phase 4 (Testing) - Ensures reliability
5. **Week 5+:** Phase 5 (Production) - Optimization for scale

### Quick Wins (Can be done in 1 day):
- Password hashing (1h)
- JWT secret key (30min)
- Password validation (30min)
- Fix DB error handling (15min)
- Add rate limiting (1h)
- Add structured logging (2h)

**Total Quick Wins: ~5 hours**

---

## 📞 Support

For questions or clarifications on any improvement task, refer to:
- Backend code: `backend/services/`
- ML code: `ml/train_model.py`
- Frontend code: `frontend/components/`
- Documentation: `README.md`

---

---

## 📈 Progress Tracking

### Completed Phases:
- ✅ **Phase 0: Monetization Features** (6 hours) - Free credits system with subscription tiers

### In Progress:
- ⏳ None

### Next Up:
- 🔴 **Phase 1: Critical Security Fixes** - URGENT before deployment

---

**Last Updated:** 2026-06-06  
**Version:** 1.1  
**Changelog:**
- v1.1 (2026-06-06): Added Phase 0 - Monetization Features (completed)
- v1.0 (2026-06-06): Initial improvement plan created
