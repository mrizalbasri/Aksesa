from fastapi import APIRouter, Depends

from routes.responses import service_error_response
from schemas.auth import GoogleLoginRequest, LoginRequest, LoginResponse, UserResponse
from services.auth_service import (
    AuthUser,
    authenticate_google_credential,
    authenticate_user,
    create_access_token,
    get_current_user,
)
from services.errors import ServiceError

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])


@router.post("/login", response_model=LoginResponse)
async def login(payload: LoginRequest):
    try:
        user = authenticate_user(payload.email, payload.password)
    except ServiceError as error:
        return service_error_response(error)

    token, expires_in = create_access_token(user)
    return LoginResponse(
        access_token=token,
        expires_in=expires_in,
        user=UserResponse(id=user.id, email=user.email, name=user.name, role=user.role),
    )


@router.post("/google", response_model=LoginResponse)
async def login_google(payload: GoogleLoginRequest):
    try:
        user = await authenticate_google_credential(payload.credential)
    except ServiceError as error:
        return service_error_response(error)

    token, expires_in = create_access_token(user)
    return LoginResponse(
        access_token=token,
        expires_in=expires_in,
        user=UserResponse(id=user.id, email=user.email, name=user.name, role=user.role),
    )


@router.get("/me", response_model=UserResponse)
async def me(user: AuthUser = Depends(get_current_user)):
    return UserResponse(
        id=user.id,
        email=user.email,
        name=user.name,
        role=user.role,
    )

