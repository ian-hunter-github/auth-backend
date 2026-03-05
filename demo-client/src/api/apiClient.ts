import { getFunctionsBaseUrl } from "../config";
import { isErrorEnvelope, isSuccessEnvelope } from "../types/apiTypes";

export type ApiError = {
  status: number;
  code: string;
  message: string;
  details?: unknown;
  requestId?: string;
};

export type ApiLogEntry = {
  method: string;
  path: string;
  url: string;
  status: number;
  ms: number;
  ok: boolean;
  requestBody?: unknown;
  responseBody?: unknown;
  errorMessage?: string;
};

export type ApiLogger = (e: ApiLogEntry) => void;

type FetchInit = Parameters<typeof fetch>[1];

export type ApiClient = {
  get<T>(path: string, opts?: { headers?: Record<string, string> }): Promise<T>;
  post<T>(path: string, body?: unknown, opts?: { headers?: Record<string, string> }): Promise<T>;
  patch<T>(path: string, body?: unknown, opts?: { headers?: Record<string, string> }): Promise<T>;
  del<T>(path: string, opts?: { headers?: Record<string, string> }): Promise<T>;
  raw: {
    request(method: string, path: string, init?: FetchInit): Promise<Response>;
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
  if (isSuccessEnvelope<T>(body)) return body.data;
  if (isErrorEnvelope(body)) throw toApiError(status, body);
  return body as T;
}

export function createApiClient(getAccessToken: () => string | undefined, logger?: ApiLogger): ApiClient {
  const baseUrl = getFunctionsBaseUrl();

  async function request(method: string, path: string, init?: FetchInit): Promise<Response> {
    const url = joinUrl(baseUrl, path);
    const headers: Record<string, string> = {
      ...(init?.headers ? (init.headers as Record<string, string>) : {})
    };

    const token = getAccessToken();
    if (token) headers.authorization = `Bearer ${token}`;

    return fetch(url, {
      ...init,
      method,
      headers
    });
  }

  async function jsonRequest<T>(
    method: string,
    path: string,
    body?: unknown,
    extraHeaders?: Record<string, string>
  ): Promise<T> {
    const headers: Record<string, string> = {
      ...(extraHeaders || {})
    };

    let payload: string | undefined;
    if (body !== undefined) {
      headers["content-type"] = headers["content-type"] || "application/json";
      payload = JSON.stringify(body);
    }

    const started = performance.now();
    const url = joinUrl(baseUrl, path);

    try {
      const res = await request(method, path, {
        headers,
        ...(payload !== undefined ? { body: payload } : {})
      });

      const parsed = await readJsonSafe(res);
      const ms = Math.max(0, Math.round(performance.now() - started));

      if (!res.ok) {
        logger?.({
          method,
          path,
          url,
          status: res.status,
          ms,
          ok: false,
          requestBody: body,
          responseBody: parsed
        });

        throw toApiError(res.status, parsed);
      }

      logger?.({
        method,
        path,
        url,
        status: res.status,
        ms,
        ok: true,
        requestBody: body,
        responseBody: parsed
      });

      return unwrapEnvelope<T>(res.status, parsed) as T;
    } catch (err) {
      const ms = Math.max(0, Math.round(performance.now() - started));

      if ((err as { status?: unknown })?.status === undefined) {
        logger?.({
          method,
          path,
          url,
          status: 0,
          ms,
          ok: false,
          requestBody: body,
          responseBody: null,
          errorMessage: err instanceof Error ? err.message : String(err)
        });
      }

      throw err;
    }
  }

  return {
    get: (path, opts) => jsonRequest("GET", path, undefined, opts?.headers),
    post: (path, body, opts) => jsonRequest("POST", path, body, opts?.headers),
    patch: (path, body, opts) => jsonRequest("PATCH", path, body, opts?.headers),
    del: (path, opts) => jsonRequest("DELETE", path, undefined, opts?.headers),
    raw: { request }
  };
}
