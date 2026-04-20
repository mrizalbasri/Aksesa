from pydantic import BaseModel, ConfigDict, Field


class TransactionInput(BaseModel):
    date: str = Field(min_length=1)
    amount: float = Field(gt=0)


class ScoringRequest(BaseModel):
    transactions: list[TransactionInput] = Field(default_factory=list)
    tokopedia: float = Field(default=0, ge=0)
    shopee: float = Field(default=0, ge=0)
    businessAge: int = Field(default=0, ge=0)
    employees: int = Field(default=0, ge=0)
    location: str = ""


class ScoringResponse(BaseModel):
    score: int
    risk_category: str
    factors: list[str]
    recommendations: list[str]


class DocumentOcrResponse(BaseModel):
    file_name: str
    status: str
    extracted_text: str


class LoanSimulationRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    amount: float = Field(gt=0)
    score: int = Field(ge=0, le=100)
    tenor_months: int = Field(default=12, ge=1, alias="tenorMonths")


class LoanSimulationResponse(BaseModel):
    amount: float
    score: int
    tenor_months: int
    monthly_interest_rate: float
    estimated_monthly_payment: float


class ScoringHistoryItem(BaseModel):
    id: str
    score: int
    risk_category: str
    created_at: str


class ScoringHistoryResponse(BaseModel):
    items: list[ScoringHistoryItem]
    total: int


class DocumentUploadResponse(BaseModel):
    filename: str
    url: str
    size_bytes: int
    content_type: str

