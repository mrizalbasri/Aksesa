const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:8000";

export const SESSION_SCORING_RESULT_KEY = "aksesa_scoring_result";
export const SESSION_AUTH_TOKEN_KEY = "aksesa_auth_token";
export const AUTH_CHANGED_EVENT = "aksesa-auth-changed";

type RequestOptions = Omit<RequestInit, "headers"> & {
  token?: string;
  headers?: Record<string, string>;
};

type ApiErrorShape = {
  error?: {
    code?: string;
    message?: string;
  };
};

export class ApiError extends Error {
  code?: string;
  status: number;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

async function requestJson<T>(
  path: string,
  { token, headers, ...options }: RequestOptions = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {}),
    },
  });

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const parsed = body as ApiErrorShape | null;
    const message =
      parsed?.error?.message ?? "Terjadi kendala saat memproses permintaan.";
    throw new ApiError(message, response.status, parsed?.error?.code);
  }

  return body as T;
}

export interface ScoringRequestPayload {
  transactions: { date: string; amount: number }[];
  tokopedia: number;
  shopee: number;
  businessAge: number;
  employees: number;
  location: string;
}

export interface ScoringResponsePayload {
  score: number;
  risk_category: string;
  factors: string[];
  recommendations: string[];
}

export interface OcrResponsePayload {
  file_name: string;
  status: string;
  extracted_text: string;
}

export interface LoginResponsePayload {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface ResultCreatePayload {
  score: number;
  risk_category: string;
  factors: string[];
  recommendations: string[];
  summary?: string;
  metadata?: Record<string, unknown>;
}

export interface ResultResponsePayload {
  id: string;
  score: number;
  risk_category: string;
  factors: string[];
  recommendations: string[];
  summary: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface ShareResultResponsePayload {
  result_id: string;
  share_url: string;
  shared_at: string;
}

export interface ExportResultPdfResponsePayload {
  result_id: string;
  download_url: string;
  generated_at: string;
}

export interface MeResponsePayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function uploadInvoiceForOcr(file: File): Promise<OcrResponsePayload> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/v1/documents/ocr`, {
    method: "POST",
    body: formData,
  });

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const parsed = body as ApiErrorShape | null;
    const message =
      parsed?.error?.message ?? "Gagal memproses dokumen invoice.";
    throw new ApiError(message, response.status, parsed?.error?.code);
  }

  return body as OcrResponsePayload;
}

export function submitScoring(
  payload: ScoringRequestPayload,
): Promise<ScoringResponsePayload> {
  return requestJson<ScoringResponsePayload>("/api/v1/scoring", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(
  email: string,
  password: string,
): Promise<LoginResponsePayload> {
  return requestJson<LoginResponsePayload>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function loginWithGoogle(
  credential: string,
): Promise<LoginResponsePayload> {
  return requestJson<LoginResponsePayload>("/api/v1/auth/google", {
    method: "POST",
    body: JSON.stringify({ credential }),
  });
}

export function getMe(token: string): Promise<MeResponsePayload> {
  return requestJson<MeResponsePayload>("/api/v1/auth/me", { token });
}

export function createResult(
  payload: ResultCreatePayload,
  token: string,
): Promise<ResultResponsePayload> {
  return requestJson<ResultResponsePayload>("/api/v1/results", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export function getResult(
  resultId: string,
  token: string,
): Promise<ResultResponsePayload> {
  return requestJson<ResultResponsePayload>(`/api/v1/results/${resultId}`, {
    token,
  });
}

export function shareResult(
  resultId: string,
  token: string,
): Promise<ShareResultResponsePayload> {
  return requestJson<ShareResultResponsePayload>(
    `/api/v1/results/${resultId}/share`,
    {
      method: "POST",
      token,
    },
  );
}

export function exportResultPdf(
  resultId: string,
  token: string,
): Promise<ExportResultPdfResponsePayload> {
  return requestJson<ExportResultPdfResponsePayload>(
    `/api/v1/results/${resultId}/export/pdf`,
    {
      token,
    },
  );
}
