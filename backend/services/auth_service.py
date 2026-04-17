import os
import hmac
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from functools import lru_cache

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from services.errors import ServiceError

security = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class AuthUser:
    id: str
    email: str
    name: str
    role: str


@dataclass(frozen=True)
class _StoredUser:
    id: str
    email: str
    name: str
    role: str
    password: str


def _get_secret_key() -> str:
    return os.getenv("SECRET_KEY", "dev-secret-key-change-me")


def _get_algorithm() -> str:
    return os.getenv("ALGORITHM", "HS256")


def _get_access_token_expiry_minutes() -> int:
    return int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))


@lru_cache(maxsize=1)
def _get_demo_user() -> _StoredUser:
    email = os.getenv("DEMO_USER_EMAIL", "demo@aksesa.id").strip().lower()
    password = os.getenv("DEMO_USER_PASSWORD", "Aksesa123!")
    name = os.getenv("DEMO_USER_NAME", "Demo UMKM")
    return _StoredUser(
        id="demo-user",
        email=email,
        name=name,
        role="demo",
        password=password,
    )


def _to_auth_user(user: _StoredUser) -> AuthUser:
    return AuthUser(id=user.id, email=user.email, name=user.name, role=user.role)


def authenticate_user(email: str, password: str) -> AuthUser:
    candidate_email = email.strip().lower()
    demo_user = _get_demo_user()
    valid_email = candidate_email == demo_user.email
    valid_password = hmac.compare_digest(password, demo_user.password)

    if not valid_email or not valid_password:
        raise ServiceError(
            code="INVALID_CREDENTIALS",
            message="Email atau password tidak valid.",
            status_code=401,
        )

    return _to_auth_user(demo_user)


def create_access_token(user: AuthUser) -> tuple[str, int]:
    expires_in_minutes = _get_access_token_expiry_minutes()
    expires_at = datetime.now(tz=timezone.utc) + timedelta(minutes=expires_in_minutes)
    payload = {
        "sub": user.id,
        "email": user.email,
        "name": user.name,
        "role": user.role,
        "exp": expires_at,
    }
    encoded_token = jwt.encode(payload, _get_secret_key(), algorithm=_get_algorithm())
    return encoded_token, expires_in_minutes * 60


def decode_access_token(token: str) -> AuthUser:
    try:
        payload = jwt.decode(token, _get_secret_key(), algorithms=[_get_algorithm()])
    except JWTError as exc:
        raise ServiceError(
            code="AUTH_REQUIRED",
            message="Login diperlukan untuk aksi ini.",
            status_code=401,
        ) from exc

    user_id = payload.get("sub")
    email = payload.get("email")
    name = payload.get("name")
    role = payload.get("role")
    if (
        not isinstance(user_id, str)
        or not isinstance(email, str)
        or not isinstance(name, str)
        or not isinstance(role, str)
    ):
        raise ServiceError(
            code="AUTH_REQUIRED",
            message="Login diperlukan untuk aksi ini.",
            status_code=401,
        )

    demo_user = _get_demo_user()
    if email.strip().lower() != demo_user.email:
        raise ServiceError(
            code="AUTH_REQUIRED",
            message="Login diperlukan untuk aksi ini.",
            status_code=401,
        )

    return AuthUser(id=user_id, email=email, name=name, role=role)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
) -> AuthUser:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise ServiceError(
            code="AUTH_REQUIRED",
            message="Login diperlukan untuk aksi ini.",
            status_code=401,
        )
    return decode_access_token(credentials.credentials)

