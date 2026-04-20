import os
from typing import Any

from openai import AzureOpenAI

from schemas.scoring import ScoringRequest, ScoringResponse
from services.errors import ServiceError


def _get_openai_client() -> AzureOpenAI:
    api_key = os.getenv("AZURE_OPENAI_KEY", "").strip()
    api_base = os.getenv("AZURE_OPENAI_ENDPOINT", "").strip()
    api_version = os.getenv("AZURE_OPENAI_API_VERSION", "2024-02-15-preview").strip()

    if not api_key or not api_base:
        raise ServiceError(
            code="SERVICE_NOT_CONFIGURED",
            message="Azure OpenAI belum dikonfigurasi.",
            status_code=503,
        )

    return AzureOpenAI(
        api_key=api_key,
        api_version=api_version,
        azure_endpoint=api_base,
    )


def _build_recommendation_prompt(
    payload: ScoringRequest,
    score: int,
    risk_category: str,
    factors: list[str],
) -> str:
    transaction_count = len(payload.transactions)
    avg_amount = (
        sum(item.amount for item in payload.transactions) / transaction_count
        if transaction_count > 0
        else 0
    )
    marketplace_total = payload.tokopedia + payload.shopee

    return f"""Anda adalah asisten keuangan untuk UKM Indonesia.
Berdasarkan data berikut, berikan 2-3 rekomendasi personal untuk meningkatkan skor kredit:

Profil Bisnis:
- Usia bisnis: {payload.businessAge} tahun
- Jumlah karyawan: {payload.employees}
- Lokasi: {payload.location if payload.location else 'Tidak disebutkan'}
- Rata-rata transaksi: Rp {avg_amount:,.0f}
- Total penjualan marketplace: Rp {marketplace_total:,.0f}

Skor Kredit Saat Ini: {score}/100
Kategori Risiko: {risk_category}

Faktor yang mempengaruhi skor:
{chr(10).join(f"- {f}" for f in factors)}

Berikan rekomendasi dalam bahasa Indonesia yang mudah dipahami.
Setiap rekomendasi maksimal 1 kalimat. Fokus pada langkah konkret yang bisa dilakukan dalam 1-3 bulan."""


def generate_recommendations(
    payload: ScoringRequest,
    score: int,
    risk_category: str,
    factors: list[str],
) -> list[str]:
    try:
        client = _get_openai_client()
    except ServiceError:
        return _get_fallback_recommendations(risk_category)

    deployment_name = os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-4o").strip()
    prompt = _build_recommendation_prompt(payload, score, risk_category, factors)

    try:
        response = client.chat.completions.create(
            model=deployment_name,
            messages=[
                {
                    "role": "system",
                    "content": "Anda adalah asisten keuangan yang membantu UKM Indonesia meningkatkan skor kredit mereka. Berikan rekomendasi yang praktis dan realistis.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=500,
        )

        content = response.choices[0].message.content
        if not content:
            return _get_fallback_recommendations(risk_category)

        recommendations = [
            line.strip()
            for line in content.split("\n")
            if line.strip() and not line.strip().startswith(("1.", "2.", "3."))
        ]
        recommendations = [
            line.lstrip("0123456789. ").strip() for line in recommendations
        ]
        recommendations = [line for line in recommendations if len(line) > 10]

        return recommendations[:3] if recommendations else _get_fallback_recommendations(risk_category)

    except Exception:
        return _get_fallback_recommendations(risk_category)


def generate_naration(score: int, risk_category: str) -> str:
    try:
        client = _get_openai_client()
    except ServiceError:
        return _get_fallback_naration(score, risk_category)

    deployment_name = os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-4o").strip()

    prompt = f"""Tuliskan narasi singkat (maksimal 2 kalimat) untuk hasil scoring kredit dengan:
- Skor: {score}/100
- Kategori: {risk_category}

Narasi harus dalam bahasa Indonesia yang mudah dipahami oleh pelaku UKM."""

    try:
        response = client.chat.completions.create(
            model=deployment_name,
            messages=[
                {
                    "role": "system",
                    "content": "Anda adalah asisten keuangan. Berikan penjelasan yang jelas dan profesional.",
                },
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
            max_tokens=200,
        )

        content = response.choices[0].message.content
        return content if content else _get_fallback_naration(score, risk_category)

    except Exception:
        return _get_fallback_naration(score, risk_category)


def _get_fallback_recommendations(risk_category: str) -> list[str]:
    base = [
        "Pertahankan pencatatan transaksi harian agar evaluasi skor lebih akurat.",
        "Pisahkan rekening bisnis dan pribadi untuk meningkatkan kepercayaan data.",
    ]
    if risk_category == "high":
        base.insert(0, "Fokus menaikkan konsistensi transaksi selama 2-3 bulan ke depan.")
    elif risk_category == "medium":
        base.insert(0, "Tingkatkan bukti pendapatan rutin untuk mendorong skor ke kategori layak.")
    else:
        base.insert(0, "Profil bisnis Anda sudah kuat, lanjutkan disiplin pembayaran.")
    return base


def _get_fallback_naration(score: int, risk_category: str) -> str:
    if risk_category == "high":
        return f"Skor kredit Anda saat ini adalah {score}. Fokus pada peningkatan konsistensi transaksi dan pendataan yang lebih baik."
    elif risk_category == "medium":
        return f"Skor kredit Anda adalah {score}. Dengan sedikit peningkatan, Anda bisa mencapai kategori layak kredit."
    else:
        return f"Selamat! Skor kredit Anda {score} menunjukkan profil bisnis yang kuat dan layak mendapatkan pembiayaan."