import os
from typing import Any

from azure.ai.documentintelligence import DocumentIntelligenceClient
from azure.ai.documentintelligence.models import AnalyzeDocumentRequest, AnalyzeResult
from azure.core.credentials import AzureKeyCredential

from services.errors import ServiceError


def _get_endpoint() -> str:
    endpoint = os.getenv("AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT", "").strip()
    if not endpoint:
        raise ServiceError(
            code="SERVICE_NOT_CONFIGURED",
            message="Azure Document Intelligence belum dikonfigurasi.",
            status_code=503,
        )
    return endpoint


def _get_api_key() -> str:
    api_key = os.getenv("AZURE_DOCUMENT_INTELLIGENCE_KEY", "").strip()
    if not api_key:
        raise ServiceError(
            code="SERVICE_NOT_CONFIGURED",
            message="Azure Document Intelligence belum dikonfigurasi.",
            status_code=503,
        )
    return api_key


def _get_model_id() -> str:
    return os.getenv("AZURE_DOCUMENT_INTELLIGENCE_MODEL", "prebuilt-invoice").strip()


def _get_client() -> DocumentIntelligenceClient:
    return DocumentIntelligenceClient(
        endpoint=_get_endpoint(),
        credential=AzureKeyCredential(_get_api_key()),
    )


def extract_invoice_data(file_bytes: bytes) -> dict[str, Any]:
    try:
        client = _get_client()
        model_id = _get_model_id()

        poller = client.begin_analyze_document(
            model_id=model_id,
            analyze_request=AnalyzeDocumentRequest(bytes_source=file_bytes),
            content_type="application/octet-stream",
        )

        result: AnalyzeResult = poller.result()

        extracted_data: dict[str, Any] = {
            "status": "success",
            "documents": [],
        }

        if result.documents:
            for doc in result.documents:
                doc_data: dict[str, Any] = {}
                if doc.doc_type:
                    doc_data["doc_type"] = doc.doc_type
                if doc.fields:
                    for field_name, field in doc.fields.items():
                        if field.value:
                            doc_data[field_name] = field.value
                extracted_data["documents"].append(doc_data)

        return extracted_data

    except Exception as exc:
        raise ServiceError(
            code="OCR_FAILED",
            message=f"Gagal memproses dokumen: {str(exc)}",
            status_code=500,
        ) from exc


def extract_text_only(file_bytes: bytes) -> str:
    try:
        client = _get_client()
        model_id = _get_model_id()

        poller = client.begin_analyze_document(
            model_id=model_id,
            analyze_request=AnalyzeDocumentRequest(bytes_source=file_bytes),
            content_type="application/octet-stream",
        )

        result: AnalyzeResult = poller.result()

        text_parts: list[str] = []
        if result.content:
            text_parts.append(result.content)

        if result.paragraphs:
            for para in result.paragraphs:
                if para.content:
                    text_parts.append(para.content)

        return "\n\n".join(text_parts)

    except Exception as exc:
        raise ServiceError(
            code="OCR_FAILED",
            message=f"Gagal memproses dokumen: {str(exc)}",
            status_code=500,
        ) from exc