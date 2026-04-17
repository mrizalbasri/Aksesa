from dataclasses import dataclass
from datetime import datetime, timezone
from threading import Lock
from typing import Any
from uuid import uuid4

from schemas.results import (
    ExportPdfResponse,
    ResultCreateRequest,
    ResultResponse,
    ShareResultResponse,
)
from services.auth_service import AuthUser
from services.errors import ServiceError


@dataclass
class _StoredResult:
    id: str
    owner_id: str
    score: int
    risk_category: str
    factors: list[str]
    recommendations: list[str]
    summary: str | None
    metadata: dict[str, Any]
    created_at: datetime


_result_store: dict[str, _StoredResult] = {}
_store_lock = Lock()


def _to_result_response(record: _StoredResult) -> ResultResponse:
    return ResultResponse(
        id=record.id,
        score=record.score,
        risk_category=record.risk_category,
        factors=record.factors,
        recommendations=record.recommendations,
        summary=record.summary,
        metadata=record.metadata,
        created_at=record.created_at,
    )


def create_result(user: AuthUser, payload: ResultCreateRequest) -> ResultResponse:
    result_id = str(uuid4())
    record = _StoredResult(
        id=result_id,
        owner_id=user.id,
        score=payload.score,
        risk_category=payload.risk_category,
        factors=list(payload.factors),
        recommendations=list(payload.recommendations),
        summary=payload.summary,
        metadata=dict(payload.metadata),
        created_at=datetime.now(tz=timezone.utc),
    )

    with _store_lock:
        _result_store[result_id] = record

    return _to_result_response(record)


def get_result(user: AuthUser, result_id: str) -> ResultResponse:
    with _store_lock:
        record = _result_store.get(result_id)

    if record is None or record.owner_id != user.id:
        raise ServiceError(
            code="RESULT_NOT_FOUND",
            message="Hasil scoring tidak ditemukan.",
            status_code=404,
        )

    return _to_result_response(record)


def share_result(user: AuthUser, result_id: str) -> ShareResultResponse:
    _ = get_result(user, result_id)
    shared_at = datetime.now(tz=timezone.utc)
    return ShareResultResponse(
        result_id=result_id,
        share_url=f"https://aksesa.id/results/{result_id}",
        shared_at=shared_at,
    )


def export_result_pdf(user: AuthUser, result_id: str) -> ExportPdfResponse:
    _ = get_result(user, result_id)
    generated_at = datetime.now(tz=timezone.utc)
    return ExportPdfResponse(
        result_id=result_id,
        download_url=f"https://aksesa.id/api/v1/results/{result_id}/export/file.pdf",
        generated_at=generated_at,
    )

