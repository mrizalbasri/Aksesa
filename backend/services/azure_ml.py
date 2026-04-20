import os
from typing import Any

from azure.ai.ml import MLClient
from azure.ai.ml.entities import Model
from azure.identity import DefaultAzureCredential

from schemas.scoring import ScoringRequest
from services.errors import ServiceError


def _get_ml_client() -> MLClient:
    try:
        subscription_id = os.getenv("AZURE_SUBSCRIPTION_ID", "").strip()
        resource_group = os.getenv("AZURE_RESOURCE_GROUP", "").strip()
        workspace_name = os.getenv("AZURE_ML_WORKSPACE_NAME", "").strip()

        if not all([subscription_id, resource_group, workspace_name]):
            raise ServiceError(
                code="SERVICE_NOT_CONFIGURED",
                message="Azure ML workspace belum dikonfigurasi.",
                status_code=503,
            )

        return MLClient(
            DefaultAzureCredential(),
            subscription_id=subscription_id,
            resource_group_name=resource_group,
            workspace_name=workspace_name,
        )
    except Exception as exc:
        raise ServiceError(
            code="SERVICE_NOT_CONFIGURED",
            message="Azure ML workspace belum dikonfigurasi.",
            status_code=503,
        ) from exc


def get_credit_score(payload: ScoringRequest) -> dict[str, Any]:
    client = _get_ml_client()

    model_name = os.getenv("AZURE_ML_MODEL_NAME", "credit-scoring-model").strip()
    model_version = os.getenv("AZURE_ML_MODEL_VERSION", "1").strip()

    try:
        model = client.models.get(name=model_name, version=model_version)
    except Exception:
        return {"fallback": True, "message": "Model not deployed, using rule-based scoring"}

    transaction_count = len(payload.transactions)
    avg_amount = (
        sum(item.amount for item in payload.transactions) / transaction_count
        if transaction_count > 0
        else 0
    )

    marketplace_total = payload.tokopedia + payload.shopee

    input_features = {
        "transaction_count": transaction_count,
        "avg_transaction_amount": avg_amount,
        "marketplace_income": marketplace_total,
        "business_age": payload.businessAge,
        "employees": payload.employees,
        "has_location": 1 if payload.location.strip() else 0,
    }

    return {
        "fallback": False,
        "model_name": model.name,
        "model_version": model.version,
        "features": input_features,
    }


def check_ml_service_status() -> dict[str, Any]:
    try:
        client = _get_ml_client()
        workspace = client.workspaces.get(client.workspace_name)
        return {
            "status": "healthy",
            "workspace": workspace.name,
            "location": workspace.location,
        }
    except ServiceError:
        return {"status": "not_configured"}
    except Exception:
        return {"status": "error"}