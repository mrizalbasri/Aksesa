from fastapi.responses import JSONResponse

from schemas.common import ErrorBody, ErrorResponse
from services.errors import ServiceError


def service_error_response(error: ServiceError) -> JSONResponse:
    response = ErrorResponse(error=ErrorBody(code=error.code, message=error.message))
    return JSONResponse(status_code=error.status_code, content=response.model_dump())

