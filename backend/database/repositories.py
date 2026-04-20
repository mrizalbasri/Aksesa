import json
from datetime import datetime
from typing import Any
from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from database.models import Document, DocumentType, RiskCategory, ScoringResult, Transaction, User, UserRole
from services.errors import ServiceError


async def create_user(
    db: AsyncSession,
    email: str,
    name: str,
    role: UserRole = UserRole.USER,
    business_name: str | None = None,
    business_address: str | None = None,
    phone: str | None = None,
) -> User:
    user = User(
        id=str(uuid4()),
        email=email.lower().strip(),
        name=name,
        role=role,
        business_name=business_name,
        business_address=business_address,
        phone=phone,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    result = await db.execute(
        select(User).where(User.email == email.lower().strip())
    )
    return result.scalar_one_or_none()


async def get_user_by_id(db: AsyncSession, user_id: str) -> User | None:
    result = await db.execute(
        select(User).where(User.id == user_id)
    )
    return result.scalar_one_or_none()


async def update_user(
    db: AsyncSession,
    user_id: str,
    **kwargs: Any,
) -> User:
    user = await get_user_by_id(db, user_id)
    if not user:
        raise ServiceError(
            code="USER_NOT_FOUND",
            message="User tidak ditemukan.",
            status_code=404,
        )

    for key, value in kwargs.items():
        if hasattr(user, key):
            setattr(user, key, value)

    await db.commit()
    await db.refresh(user)
    return user


async def create_scoring_result(
    db: AsyncSession,
    user_id: str,
    score: int,
    risk_category: RiskCategory,
    factors: list[str],
    recommendations: list[str],
    summary: str | None = None,
    metadata: dict[str, Any] | None = None,
    transactions: list[dict[str, Any]] | None = None,
) -> ScoringResult:
    result_id = str(uuid4())

    scoring_result = ScoringResult(
        id=result_id,
        user_id=user_id,
        score=score,
        risk_category=risk_category,
        factors=json.dumps(factors, ensure_ascii=False),
        recommendations=json.dumps(recommendations, ensure_ascii=False),
        summary=summary,
        metadata=json.dumps(metadata, ensure_ascii=False) if metadata else None,
    )

    if transactions:
        for tx in transactions:
            tx_obj = Transaction(
                id=str(uuid4()),
                scoring_result_id=result_id,
                date=tx.get("date", ""),
                amount=tx.get("amount", 0),
                description=tx.get("description"),
            )
            db.add(tx_obj)

    db.add(scoring_result)
    await db.commit()
    await db.refresh(scoring_result)
    return scoring_result


async def get_scoring_result_by_id(
    db: AsyncSession,
    result_id: str,
    user_id: str,
) -> ScoringResult | None:
    result = await db.execute(
        select(ScoringResult)
        .options(selectinload(ScoringResult.transactions))
        .where(ScoringResult.id == result_id, ScoringResult.user_id == user_id)
    )
    return result.scalar_one_or_none()


async def get_user_scoring_history(
    db: AsyncSession,
    user_id: str,
    limit: int = 20,
    offset: int = 0,
) -> tuple[list[ScoringResult], int]:
    count_result = await db.execute(
        select(ScoringResult).where(ScoringResult.user_id == user_id)
    )
    total = len(count_result.scalars().all())

    result = await db.execute(
        select(ScoringResult)
        .where(ScoringResult.user_id == user_id)
        .order_by(ScoringResult.created_at.desc())
        .offset(offset)
        .limit(limit)
    )
    items = list(result.scalars().all())

    return items, total


async def create_document(
    db: AsyncSession,
    user_id: str,
    filename: str,
    original_filename: str,
    content_type: str,
    file_size: int,
    document_type: DocumentType = DocumentType.OTHER,
    ocr_text: str | None = None,
    blob_url: str | None = None,
) -> Document:
    doc = Document(
        id=str(uuid4()),
        user_id=user_id,
        filename=filename,
        original_filename=original_filename,
        content_type=content_type,
        file_size=file_size,
        document_type=document_type,
        ocr_text=ocr_text,
        blob_url=blob_url or "",
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)
    return doc


async def get_user_documents(
    db: AsyncSession,
    user_id: str,
    limit: int = 50,
    offset: int = 0,
) -> tuple[list[Document], int]:
    count_result = await db.execute(
        select(Document).where(Document.user_id == user_id)
    )
    total = len(count_result.scalars().all())

    result = await db.execute(
        select(Document)
        .where(Document.user_id == user_id)
        .order_by(Document.created_at.desc())
        .offset(offset)
        .limit(limit)
    )
    items = list(result.scalars().all())

    return items, total