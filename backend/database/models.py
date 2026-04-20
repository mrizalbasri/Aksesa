from datetime import datetime
from enum import Enum

from sqlalchemy import DateTime, Enum as SQLEnum, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"
    DEMO = "demo"


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(
        SQLEnum(UserRole), default=UserRole.USER, nullable=False
    )
    business_name: Mapped[str | None] = mapped_column(String(255), default=None)
    business_address: Mapped[str | None] = mapped_column(Text, default=None)
    phone: Mapped[str | None] = mapped_column(String(20), default=None)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    scoring_results: Mapped[list["ScoringResult"]] = relationship(
        "ScoringResult", back_populates="user", cascade="all, delete-orphan"
    )
    documents: Mapped[list["Document"]] = relationship(
        "Document", back_populates="user", cascade="all, delete-orphan"
    )


class RiskCategory(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    ELIGIBLE = "eligible"


class ScoringResult(Base):
    __tablename__ = "scoring_results"

    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    user_id: Mapped[str] = mapped_column(
        String(80), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    score: Mapped[int] = mapped_column(Integer, nullable=False)
    risk_category: Mapped[RiskCategory] = mapped_column(SQLEnum(RiskCategory), nullable=False)
    factors: Mapped[str] = mapped_column(Text, nullable=False)
    recommendations: Mapped[str] = mapped_column(Text, nullable=False)
    summary: Mapped[str | None] = mapped_column(Text, default=None)
    meta_data: Mapped[str | None] = mapped_column("metadata", Text, default=None)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    user: Mapped["User"] = relationship("User", back_populates="scoring_results")
    transactions: Mapped[list["Transaction"]] = relationship(
        "Transaction", back_populates="scoring_result", cascade="all, delete-orphan"
    )


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    scoring_result_id: Mapped[str] = mapped_column(
        String(80),
        ForeignKey("scoring_results.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    date: Mapped[str] = mapped_column(String(20), nullable=False)
    amount: Mapped[float] = mapped_column(Integer, nullable=False)
    description: Mapped[str | None] = mapped_column(String(500), default=None)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    scoring_result: Mapped["ScoringResult"] = relationship(
        "ScoringResult", back_populates="transactions"
    )


class DocumentType(str, Enum):
    INVOICE = "invoice"
    RECEIPT = "receipt"
    MARKETPLACE = "marketplace"
    OTHER = "other"


class Document(Base):
    __tablename__ = "documents"

    id: Mapped[str] = mapped_column(String(80), primary_key=True)
    user_id: Mapped[str] = mapped_column(
        String(80), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    filename: Mapped[str] = mapped_column(String(500), nullable=False)
    original_filename: Mapped[str] = mapped_column(String(500), nullable=False)
    content_type: Mapped[str] = mapped_column(String(100), nullable=False)
    file_size: Mapped[int] = mapped_column(Integer, nullable=False)
    document_type: Mapped[DocumentType] = mapped_column(
        SQLEnum(DocumentType), default=DocumentType.OTHER, nullable=False
    )
    ocr_text: Mapped[str | None] = mapped_column(Text, default=None)
    blob_url: Mapped[str] = mapped_column(String(1000), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    user: Mapped["User"] = relationship("User", back_populates="documents")