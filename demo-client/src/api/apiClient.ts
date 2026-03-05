import { getFunctionsBaseUrl } from "../config";
import type { Envelope } from "../types/apiTypes";
import { isErrorEnvelope, isSuccessEnvelope } from "../types/apiTypes";

export type ApiError = {
  status: number;
  code: string;
  message: string;
  details?: unknown;
  requestId?: string;
};

export type ApiClient = {
  get<T>(path: string, opts?: { headers?: Record<string, string> }): Promise<T>;
  post<T>(path: string, body?: unknown, opts?: { headers?: Record<string, string> }): Promise<T>;
  patch<T>(path: string, body?: unknown, opts?: { headers?: Record<string, string> }): Promise<T>;
  del<T>(path: string, opts?: { headers?: Record<string, string> }): Promise<T>;
  raw: {
    request(method: string, path: string, init?: RequestInit): Promise<Response>;
  };
};

function joinUrl(base: string, path: string): string {
  const b = base.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
}

async function readJsonSafe(res: Response): Promise<unknown> {
  const txt = await res.text();
  if (!txt) return null;
  try {
    return JSON.parse(txt);
  } catch {
    return txt;
  }
}

function toApiError(status: number, body: unknown): ApiError {
  if (isErrorEnvelope(body)) {
    return {
      status,
      code: body.error.code,
      message: body.error.message,
      details: body.error.details,
      requestId: body.requestId
    };
  }

  return {
    status,
    code: "HTTP_ERROR",
    message: typeof body === "string" ? body : "Request failed",
    details: typeof body === "string" ? undefined : body
  };
}

function unwrapEnvelope<T>(status: number, body: unknown): T {
  // Supports both:
  // 1) { ok: true, data: <T> }
  // 2) direct payload <T> (some endpoints/tools)
  if (isSuccessEnvelope<T>(body)) return body.data;
  if (isErrorEnvelope(body)) throw toApiError(status, body);
  return body as T;
}

export function createApiClient(getAccessToken: () => string | undefined): ApiClient {
  const baseUrl = getFunctionsBaseUrl();

  async function request(method: string, path: string, init?: RequestInit): Promise<Response> {
    const url = joinUrl(baseUrl, path);
    const headers: Record<string, string> = {
      ...(init?.headers ? (init.headers as Record<string, string>) : {})
    };

    const token = getAccessToken();
    if (token) headers.authorization = `Bearer ${token}`;

    const res = await fetch(url, {
      ...init,
      method,
      headers
    });

    return res;
  }

  async function jsonRequest<T>(method: string, path: string, body?: unknown, extraHeaders?: Record<string, string>): Promise<T> {
    const headers: Record<string, string> = {
      ...(extraHeaders || {})
    };

    let payload: string | undefined;
    if (body !== undefined) {
      headers["content-type"] = headers["content-type"] || "application/json";
      payload = JSON.stringify(body);
    }

    const res = await request(method, path, {
      headers,
      ...(payload !== undefined ? { body: payload } : {})
    });

    const parsed = await readJsonSafe(res);

    if (!res.ok) throw toApiError(res.status, parsed);

    // If response is 204, parsed will be null; return as any.
    return unwrapEnvelope<T>(res.status, parsed) as T;
  }

  return {
    get: (path, opts) => jsonRequest("GET", path, undefined, opts?.headers),
    post: (path, body, opts) => jsonRequest("POST", path, body, opts?.headers),
    patch: (path, body, opts) => jsonRequest("PATCH", path, body, opts?.headers),
    del: (path, opts) => jsonRequest("DELETE", path, undefined, opts?.headers),
    raw: { request }
  };
}
