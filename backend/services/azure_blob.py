import os
import uuid
from typing import Any

from azure.storage.blob import BlobClient, BlobServiceClient, ContainerClient

from services.errors import ServiceError


def _get_connection_string() -> str:
    conn_str = os.getenv("AZURE_STORAGE_CONNECTION_STRING", "").strip()
    if not conn_str:
        raise ServiceError(
            code="SERVICE_NOT_CONFIGURED",
            message="Azure Blob Storage belum dikonfigurasi.",
            status_code=503,
        )
    return conn_str


def _get_container_name() -> str:
    return os.getenv("AZURE_STORAGE_CONTAINER", "documents").strip()


def _get_blob_service_client() -> BlobServiceClient:
    return BlobServiceClient.from_connection_string(_get_connection_string())


def _get_container_client() -> ContainerClient:
    client = _get_blob_service_client()
    container_name = _get_container_name()
    return client.get_container_client(container_name)


def upload_document(
    file_bytes: bytes,
    original_filename: str,
    content_type: str,
    user_id: str,
) -> dict[str, Any]:
    container = _get_container_client()

    file_ext = os.path.splitext(original_filename)[1] or ".bin"
    unique_filename = f"{user_id}/{uuid.uuid4()}{file_ext}"

    try:
        blob_client = container.get_blob_client(unique_filename)
        blob_client.upload_blob(
            file_bytes,
            overwrite=True,
            content_settings={"content_type": content_type},
        )

        return {
            "url": blob_client.url,
            "filename": unique_filename,
            "content_type": content_type,
            "size_bytes": len(file_bytes),
        }

    except Exception as exc:
        raise ServiceError(
            code="UPLOAD_FAILED",
            message=f"Gagal upload dokumen: {str(exc)}",
            status_code=500,
        ) from exc


def get_document_url(filename: str) -> str:
    client = _get_blob_service_client()
    blob_client = client.get_blob_client(container=_get_container_name(), blob=filename)
    return blob_client.url


def delete_document(filename: str) -> bool:
    try:
        container = _get_container_client()
        blob_client = container.get_blob_client(filename)
        blob_client.delete_blob()
        return True
    except Exception:
        return False


def list_user_documents(user_id: str) -> list[dict[str, Any]]:
    container = _get_container_client()
    prefix = f"{user_id}/"

    documents = []
    try:
        for blob in container.list_blobs(name_starts_with=prefix):
            documents.append({
                "name": blob.name,
                "size": blob.size,
                "created_on": blob.creation_time.isoformat() if blob.creation_time else None,
                "url": f"{container.url}/{blob.name}",
            })
    except Exception:
        pass

    return documents