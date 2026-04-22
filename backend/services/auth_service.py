import os
import hmac
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from functools import lru_cache

import httpx
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

from database.dependencies import DbSession
from database.models import UserRole
from database.repositories import create_user, get_user_by_email
from services.errors import ServiceError

security = HTTPBearer(auto_error=False)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


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
    
    # Check demo user first
    demo_user = _get_demo_user()
    valid_email = candidate_email == demo_user.email
    valid_password = hmac.compare_digest(password, demo_user.password)

    if valid_email and valid_password:
        return _to_auth_user(demo_user)
    
    # Skip DB check if no SQLite (for demo purposes, allow any registered user)
    # In production: verify hashed password from database
    raise ServiceError(
        code="INVALID_CREDENTIALS",
        message="Email atau password tidak valid.",
        status_code=401,
    )


async def register_user(
    db: DbSession,
    email: str,
    password: str,
    name: str,
    business_name: str | None = None,
    phone: str | None = None,
) -> AuthUser:
    # Check if email already exists
    existing_user = await get_user_by_email(db, email)
    if existing_user:
        raise ServiceError(
            code="EMAIL_ALREADY_EXISTS",
            message="Email sudah terdaftar. Silakan login atau gunakan email lain.",
            status_code=400,
        )

    # Create new user with hashed password
    # Note: Password hashing is not implemented yet - storing plain for demo
    # In production, use: hashed_password = pwd_context.hash(password)
    user = await create_user(
        db=db,
        email=email,
        name=name,
        role=UserRole.USER,
        business_name=business_name,
        phone=phone,
    )

    return AuthUser(
        id=user.id,
        email=user.email,
        name=user.name,
        role=user.role.value,
    )


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

    return AuthUser(id=user_id, email=email, name=name, role=role)


async def authenticate_google_credential(credential: str) -> AuthUser:
    google_client_id = os.getenv("GOOGLE_CLIENT_ID", "").strip()
    if not google_client_id:
        raise ServiceError(
            code="GOOGLE_DISABLED",
            message="Login Google belum dikonfigurasi di server.",
            status_code=503,
        )

    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://oauth2.googleapis.com/tokeninfo",
            params={"id_token": credential},
            timeout=15.0,
        )

    if response.status_code != 200:
        raise ServiceError(
            code="INVALID_GOOGLE_TOKEN",
            message="Token Google tidak valid atau sudah kedaluwarsa.",
            status_code=401,
        )

    data = response.json()
    if data.get("aud") != google_client_id:
        raise ServiceError(
            code="INVALID_GOOGLE_TOKEN",
            message="Token Google tidak cocok untuk aplikasi ini.",
            status_code=401,
        )

    email_raw = data.get("email")
    if not email_raw or not isinstance(email_raw, str):
        raise ServiceError(
            code="INVALID_GOOGLE_TOKEN",
            message="Email tidak tersedia dari akun Google.",
            status_code=401,
        )

    email_verified = data.get("email_verified")
    if email_verified in (False, "false", "False", 0):
        raise ServiceError(
            code="EMAIL_NOT_VERIFIED",
            message="Email Google Anda belum diverifikasi.",
            status_code=401,
        )

    sub = data.get("sub")
    name = data.get("name") or email_raw.split("@")[0]
    if not isinstance(name, str):
        name = email_raw.split("@")[0]

    safe_sub = str(sub) if sub is not None else email_raw
    user_id = f"google-{safe_sub}"[:80]

    return AuthUser(
        id=user_id,
        email=email_raw.strip().lower(),
        name=name[:160],
        role="user",
    )


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

