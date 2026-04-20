from dataclasses import dataclass
from datetime import datetime, timezone
from threading import Lock
from uuid import uuid4

from schemas.scoring import ScoringHistoryItem, ScoringHistoryResponse
from services.auth_service import AuthUser
from services.errors import ServiceError


@dataclass
class _StoredScoringHistory:
    id: str
    owner_id: str
    score: int
    risk_category: str
    created_at: datetime


_history_store: dict[str, _StoredScoringHistory] = {}
_store_lock = Lock()
_history_by_user: dict[str, list[str]] = {}


def _to_history_item(record: _StoredScoringHistory) -> ScoringHistoryItem:
    return ScoringHistoryItem(
        id=record.id,
        score=record.score,
        risk_category=record.risk_category,
        created_at=record.created_at.isoformat(),
    )


def add_to_history(
    user: AuthUser,
    score: int,
    risk_category: str,
) -> ScoringHistoryItem:
    history_id = str(uuid4())
    record = _StoredScoringHistory(
        id=history_id,
        owner_id=user.id,
        score=score,
        risk_category=risk_category,
        created_at=datetime.now(tz=timezone.utc),
    )

    with _store_lock:
        _history_store[history_id] = record
        if user.id not in _history_by_user:
            _history_by_user[user.id] = []
        _history_by_user[user.id].append(history_id)

    return _to_history_item(record)


def get_user_history(
    user: AuthUser,
    limit: int = 20,
    offset: int = 0,
) -> ScoringHistoryResponse:
    with _store_lock:
        user_history_ids = _history_by_user.get(user.id, [])
        total = len(user_history_ids)
        paginated_ids = user_history_ids[offset : offset + limit]
        items = [
            _to_history_item(_history_store[hid])
            for hid in paginated_ids
            if hid in _history_store
        ]

    return ScoringHistoryResponse(items=items, total=total)