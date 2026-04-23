"""
Machine Learning Service for Credit Scoring
Loads pre-trained scikit-learn models and provides inference
"""

import os
from typing import Any
import numpy as np
import joblib

from schemas.scoring import ScoringRequest
from services.errors import ServiceError


def _get_model_paths() -> tuple[str, str]:
    """Get paths to model and scaler files"""
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    model_path = os.path.join(base_dir, "ml", "models", "credit_model.pkl")
    scaler_path = os.path.join(base_dir, "ml", "models", "scaler.pkl")
    return model_path, scaler_path


def load_model_and_scaler() -> tuple[Any, Any]:
    """Load pre-trained model and scaler from disk"""
    model_path, scaler_path = _get_model_paths()

    if not os.path.exists(model_path) or not os.path.exists(scaler_path):
        raise ServiceError(
            code="MODEL_NOT_FOUND",
            message="Model ML belum tersedia. Jalankan training script terlebih dahulu.",
            status_code=503,
        )

    try:
        model = joblib.load(model_path)
        scaler = joblib.load(scaler_path)
        return model, scaler
    except Exception as exc:
        raise ServiceError(
            code="MODEL_LOAD_FAILED",
            message="Gagal memuat model ML.",
            status_code=500,
        ) from exc


def extract_features_from_request(payload: ScoringRequest) -> dict[str, Any]:
    """
    Extract ML features from ScoringRequest
    Maps API payload to training features
    """
    transaction_count = len(payload.transactions)
    avg_transaction_value = (
        sum(item.amount for item in payload.transactions) / transaction_count
        if transaction_count > 0
        else 0
    )

    # Calculate monthly revenue estimate from transactions
    monthly_revenue = sum(item.amount for item in payload.transactions)

    # Calculate on-time payment ratio (mock: assume 90% on-time for now)
    on_time_ratio = 0.9

    # Calculate late payment days (mock: assume 2 days average for now)
    late_payment_days = 2

    # Revenue stability estimate (mock: assume 15% std deviation)
    revenue_std = monthly_revenue * 0.15 if monthly_revenue > 0 else 0

    # Revenue trend (mock: assume slight positive trend)
    revenue_trend = 0.05

    # Marketplace presence
    marketplace_sales_ratio = (
        (payload.tokopedia + payload.shopee) / max(monthly_revenue, 1)
        if monthly_revenue > 0
        else 0
    )
    marketplace_sales_ratio = min(marketplace_sales_ratio, 1.0)

    return {
        "business_age_years": payload.businessAge,
        "num_employees": payload.employees,
        "business_type": 0,  # Default to retail (0=retail, 1=service, 2=manufacturing)
        "monthly_revenue": monthly_revenue,
        "transaction_count": transaction_count,
        "avg_transaction_value": avg_transaction_value,
        "on_time_ratio": on_time_ratio,
        "late_payment_days": late_payment_days,
        "revenue_std": revenue_std,
        "revenue_trend": revenue_trend,
        "has_marketplace": 1 if (payload.tokopedia + payload.shopee) > 0 else 0,
        "marketplace_sales_ratio": marketplace_sales_ratio,
    }


def predict_credit_score(payload: ScoringRequest) -> tuple[int, dict[str, Any]]:
    """
    Predict credit score using ML model

    Args:
        payload: ScoringRequest with user business data

    Returns:
        tuple: (predicted_score, feature_analysis)
    """
    try:
        model, scaler = load_model_and_scaler()
    except ServiceError:
        raise

    # Extract and order features
    features_dict = extract_features_from_request(payload)

    # Feature order must match training
    feature_order = [
        "business_age_years",
        "num_employees",
        "business_type",
        "monthly_revenue",
        "transaction_count",
        "avg_transaction_value",
        "on_time_ratio",
        "late_payment_days",
        "revenue_std",
        "revenue_trend",
        "has_marketplace",
        "marketplace_sales_ratio",
    ]

    feature_array = np.array([[features_dict.get(f, 0) for f in feature_order]])

    try:
        # Scale features
        feature_scaled = scaler.transform(feature_array)

        # Predict score
        prediction = model.predict(feature_scaled)[0]

        # Clamp score to 0-100
        score = int(max(0, min(100, prediction)))

        return score, features_dict
    except Exception as exc:
        raise ServiceError(
            code="PREDICTION_FAILED",
            message="Gagal melakukan prediksi skor kredit.",
            status_code=500,
        ) from exc


def get_feature_importance() -> dict[str, float]:
    """Get feature importance from trained model"""
    try:
        model, _ = load_model_and_scaler()
        feature_order = [
            "business_age_years",
            "num_employees",
            "business_type",
            "monthly_revenue",
            "transaction_count",
            "avg_transaction_value",
            "on_time_ratio",
            "late_payment_days",
            "revenue_std",
            "revenue_trend",
            "has_marketplace",
            "marketplace_sales_ratio",
        ]

        return dict(zip(feature_order, model.feature_importances_))
    except Exception:
        return {}
