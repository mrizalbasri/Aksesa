from fastapi import APIRouter, Depends

from routes.responses import service_error_response
from schemas.results import (
    ExportPdfResponse,
    ResultCreateRequest,
    ResultResponse,
    ShareResultResponse,
)
from services.auth_service import AuthUser, get_current_user
from services.errors import ServiceError
from services.result_service import (
    create_result,
    export_result_pdf,
    get_result,
    share_result,
)

router = APIRouter(prefix="/api/v1/results", tags=["Results"])


@router.post("", response_model=ResultResponse)
async def create_user_result(
    payload: ResultCreateRequest,
    user: AuthUser = Depends(get_current_user),
):
    try:
        return create_result(user, payload)
    except ServiceError as error:
        return service_error_response(error)


@router.get("/{result_id}", response_model=ResultResponse)
async def get_user_result(
    result_id: str,
    user: AuthUser = Depends(get_current_user),
):
    try:
        return get_result(user, result_id)
    except ServiceError as error:
        return service_error_response(error)


@router.post("/{result_id}/share", response_model=ShareResultResponse)
async def share_user_result(
    result_id: str,
    user: AuthUser = Depends(get_current_user),
):
    try:
        return share_result(user, result_id)
    except ServiceError as error:
        return service_error_response(error)


@router.get("/{result_id}/export/pdf", response_model=ExportPdfResponse)
async def export_user_result_pdf(
    result_id: str,
    user: AuthUser = Depends(get_current_user),
):
    try:
        return export_result_pdf(user, result_id)
    except ServiceError as error:
        return service_error_response(error)

