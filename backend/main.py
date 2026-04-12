"""
Aksesa - FastAPI Backend
AI-Powered Credit Scoring for Indonesian SMEs
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Aksesa API",
    description="AI-powered credit scoring for Indonesian SMEs",
    version="1.0.0"
)

# CORS Configuration
origins = os.getenv("ALLOWED_ORIGINS", "").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins != [""] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    """API health check endpoint"""
    return {
        "status": "healthy",
        "service": "Aksesa API",
        "version": "1.0.0"
    }

# Root endpoint
@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "Welcome to Aksesa API",
        "docs": "/docs",
        "redoc": "/redoc"
    }

# Placeholder endpoints for credit scoring
@app.post("/api/v1/scoring")
async def calculate_score(data: dict):
    """Calculate credit score based on input data"""
    return {"status": "placeholder", "message": "Scoring endpoint coming soon"}

@app.post("/api/v1/documents/ocr")
async def process_document(file: UploadFile = File(...)):
    """Process document with OCR (Azure Document Intelligence)"""
    return {"status": "placeholder", "message": "OCR processing endpoint coming soon"}

@app.post("/api/v1/simulation/loan")
async def simulate_loan(amount: float, score: int):
    """Simulate loan parameters based on credit score"""
    return {"status": "placeholder", "message": "Loan simulation endpoint coming soon"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
