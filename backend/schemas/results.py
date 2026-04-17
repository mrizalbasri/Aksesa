from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class ResultCreateRequest(BaseModel):
    score: int = Field(ge=0, le=100)
    risk_category: str = Field(min_length=1, max_length=50)
    factors: list[str] = Field(default_factory=list)
    recommendations: list[str] = Field(default_factory=list)
    summary: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)


class ResultResponse(BaseModel):
    id: str
    score: int
    risk_category: str
    factors: list[str]
    recommendations: list[str]
    summary: str | None
    metadata: dict[str, Any]
    created_at: datetime


class ShareResultResponse(BaseModel):
    result_id: str
    share_url: str
    shared_at: datetime


class ExportPdfResponse(BaseModel):
    result_id: str
    download_url: str
    generated_at: datetime

