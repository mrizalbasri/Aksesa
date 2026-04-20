from fastapi import APIRouter, Depends, File, Query, UploadFile

from routes.responses import service_error_response
from schemas.scoring import (
    DocumentOcrResponse,
    DocumentUploadResponse,
    LoanSimulationRequest,
    LoanSimulationResponse,
    ScoringHistoryResponse,
    ScoringRequest,
    ScoringResponse,
)
from services.auth_service import AuthUser, get_current_user
from services.azure_blob import upload_document
from services.azure_docintel import extract_text_only
from services.azure_openai import generate_recommendations
from services.errors import ServiceError
from services.scoring_history_service import add_to_history, get_user_history

router = APIRouter(prefix="/api/v1", tags=["Scoring"])

SUPPORTED_IMAGE_TYPES = {"image/jpeg", "image/png"}
MAX_INVOICE_FILE_SIZE_BYTES = 5 * 1024 * 1024


def _risk_category(score: int) -> str:
    if score <= 40:
        return "high"
    if score <= 70:
        return "medium"
    return "eligible"


@router.post("/scoring", response_model=ScoringResponse)
async def calculate_score(
    payload: ScoringRequest,
    user: AuthUser | None = Depends(get_current_user),
) -> ScoringResponse:
    score = 35
    factors: list[str] = []

    transaction_count = len(payload.transactions)
    if transaction_count > 0:
        avg_amount = sum(item.amount for item in payload.transactions) / transaction_count
        score += min(transaction_count * 2, 20)
        if avg_amount >= 1_000_000:
            score += 8
            factors.append("Rata-rata transaksi stabil di nominal menengah ke atas.")
        else:
            factors.append("Frekuensi transaksi aktif perlu diimbangi peningkatan nominal.")
    else:
        factors.append("Belum ada data transaksi untuk menilai arus kas.")

    marketplace_total = payload.tokopedia + payload.shopee
    if marketplace_total > 0:
        score += min(int(marketplace_total // 1_000_000), 10)
        factors.append("Terdapat penjualan marketplace yang mendukung profil pendapatan.")

    if payload.businessAge > 0:
        score += min(payload.businessAge * 2, 15)
        factors.append("Usia bisnis menunjukkan konsistensi operasional.")

    if payload.employees >= 3:
        score += 5
        factors.append("Jumlah karyawan menunjukkan kapasitas operasional yang memadai.")

    if payload.location.strip():
        score += 3

    score = max(0, min(score, 100))
    category = _risk_category(score)

    recommendations = generate_recommendations(payload, score, category, factors)

    if user:
        add_to_history(user, score, category)

    return ScoringResponse(
        score=score,
        risk_category=category,
        factors=factors,
        recommendations=recommendations,
    )


@router.post("/documents/ocr", response_model=DocumentOcrResponse)
async def process_document(file: UploadFile = File(...)):
    if file.content_type not in SUPPORTED_IMAGE_TYPES:
        raise ServiceError(
            code="ACTION_FAILED",
            message="Format file harus JPEG atau PNG.",
            status_code=400,
        )

    content = await file.read()
    if len(content) > MAX_INVOICE_FILE_SIZE_BYTES:
        raise ServiceError(
            code="ACTION_FAILED",
            message="Ukuran file maksimum 5 MB.",
            status_code=413,
        )

    try:
        extracted_text = extract_text_only(content)
    except ServiceError:
        raise
    except Exception as exc:
        raise ServiceError(
            code="OCR_FAILED",
            message="Gagal memproses dokumen invoice.",
            status_code=500,
        ) from exc

    return DocumentOcrResponse(
        file_name=file.filename or "document",
        status="processed",
        extracted_text=extracted_text,
    )


@router.post("/documents/upload", response_model=DocumentUploadResponse)
async def upload_doc(
    file: UploadFile = File(...),
    user: AuthUser = Depends(get_current_user),
):
    if file.content_type not in SUPPORTED_IMAGE_TYPES:
        raise ServiceError(
            code="ACTION_FAILED",
            message="Format file harus JPEG atau PNG.",
            status_code=400,
        )

    content = await file.read()
    if len(content) > MAX_INVOICE_FILE_SIZE_BYTES:
        raise ServiceError(
            code="ACTION_FAILED",
            message="Ukuran file maksimum 5 MB.",
            status_code=413,
        )

    try:
        result = upload_document(
            file_bytes=content,
            original_filename=file.filename or "document",
            content_type=file.content_type,
            user_id=user.id,
        )
    except ServiceError:
        raise
    except Exception as exc:
        raise ServiceError(
            code="UPLOAD_FAILED",
            message="Gagal upload dokumen.",
            status_code=500,
        ) from exc

    return DocumentUploadResponse(
        filename=result["filename"],
        url=result["url"],
        size_bytes=result["size_bytes"],
        content_type=result["content_type"],
    )


@router.post("/simulation/loan", response_model=LoanSimulationResponse)
async def simulate_loan(payload: LoanSimulationRequest) -> LoanSimulationResponse:
    if payload.score <= 40:
        monthly_interest_rate = 2.2
    elif payload.score <= 70:
        monthly_interest_rate = 1.6
    else:
        monthly_interest_rate = 1.2

    principal_component = payload.amount / payload.tenor_months
    interest_component = payload.amount * (monthly_interest_rate / 100)
    monthly_payment = principal_component + interest_component

    return LoanSimulationResponse(
        amount=payload.amount,
        score=payload.score,
        tenor_months=payload.tenor_months,
        monthly_interest_rate=monthly_interest_rate,
        estimated_monthly_payment=round(monthly_payment, 2),
    )


@router.get("/scoring/history", response_model=ScoringHistoryResponse)
async def get_scoring_history(
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    user: AuthUser = Depends(get_current_user),
):
    return get_user_history(user, limit=limit, offset=offset)

