"""
Aksesa - FastAPI Backend
AI-Powered Credit Scoring for Indonesian SMEs
"""

import json
import os

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from routes.auth import router as auth_router
from routes.results import router as results_router
from routes.scoring import router as scoring_router
from schemas.common import ErrorBody, ErrorResponse
from services.errors import ServiceError


def parse_allowed_origins(raw_origins: str | None) -> list[str]:
    if raw_origins is None or raw_origins.strip() == "":
        return ["*"]

    normalized = raw_origins.strip()

    if normalized.startswith("["):
        parsed = json.loads(normalized)
        if not isinstance(parsed, list) or not all(
            isinstance(origin, str) and origin.strip() for origin in parsed
        ):
            raise ValueError(
                "ALLOWED_ORIGINS array must contain non-empty string values."
            )
        return [origin.strip() for origin in parsed]

    origins = [origin.strip() for origin in normalized.split(",") if origin.strip()]
    return origins if origins else ["*"]


def create_app() -> FastAPI:
    load_dotenv()

    app = FastAPI(
        title="Aksesa API",
        description="AI-powered credit scoring for Indonesian SMEs",
        version="1.1.0",
    )

    origins = parse_allowed_origins(os.getenv("ALLOWED_ORIGINS"))
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.exception_handler(ServiceError)
    async def handle_service_error(
        request: Request, error: ServiceError
    ) -> JSONResponse:
        _ = request
        payload = ErrorResponse(
            error=ErrorBody(code=error.code, message=error.message)
        ).model_dump()
        return JSONResponse(status_code=error.status_code, content=payload)

    @app.get("/health")
    async def health_check() -> dict[str, str]:
        return {"status": "healthy", "service": "Aksesa API", "version": "1.1.0"}

    @app.get("/")
    async def root() -> dict[str, str]:
        return {"message": "Welcome to Aksesa API", "docs": "/docs", "redoc": "/redoc"}

    app.include_router(scoring_router)
    app.include_router(auth_router)
    app.include_router(results_router)
    return app


app = create_app()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
