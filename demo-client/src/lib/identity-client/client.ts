import { getFunctionsBaseUrl } from "../../config";
import { IdentityClientError } from "./errors";
import type {
  AdminCreateUserRequest,
  AdminUpdateUserRequest,
  AuthLoginRequest,
  AuthLoginResponse,
  AuthLogoutRequest,
  AuthRefreshResponse,
  AuthRegisterResponse,
  AuthUserProfile,
  IdentityClient,
  IdentityClientLogger,
  IdentityClientOptions,
  IdentitySessionState,
  MeResponse,
  TokenStore
} from "./types";

type FetchInit = Parameters<typeof fetch>[1];

type SuccessEnvelope<T> = {
  ok: true;
  requestId?: string;
  data: T;
};

type ErrorEnvelope = {
  ok: false;
  requestId?: string;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

type RequestOptions = {
  headers?: Record<string, string>;
  skipAuth?: boolean;
  retryOnAuthFailure?: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isSuccessEnvelope<T>(value: unknown): value is SuccessEnvelope<T> {
  return isRecord(value) && value.ok === true && "data" in value;
}

function isErrorEnvelope(value: unknown): value is ErrorEnvelope {
  if (!isRecord(value)) return false;
  if (value.ok !== false) return false;
  if (!("error" in value) || !isRecord(value.error)) return false;
  return typeof value.error.code === "string" && typeof value.error.message === "string";
}

function joinUrl(base: string, path: string): string {
  const cleanBase = base.replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
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

function toError(status: number, payload: unknown): IdentityClientError {
  if (isErrorEnvelope(payload)) {
    return new IdentityClientError({
      status,
      code: payload.error.code,
      message: payload.error.message,
      ...(payload.error.details !== undefined ? { details: payload.error.details } : {}),
      ...(payload.requestId !== undefined ? { requestId: payload.requestId } : {})
    });
  }

  if (typeof payload === "string" && payload.trim().length > 0) {
    return new IdentityClientError({
      status,
      message: payload
    });
  }

  return new IdentityClientError({
    status,
    message: `HTTP ${status}`
  });
}

function unwrapEnvelope<T>(status: number, payload: unknown): T {
  if (isSuccessEnvelope<T>(payload)) {
    return payload.data;
  }

  if (isErrorEnvelope(payload)) {
    throw toError(status, payload);
  }

  return payload as T;
}

function createNoopTokenStore(): TokenStore {
  return {
    get(): IdentitySessionState | null {
      return null;
    },
    set(): void {
      // noop
    }
  };
}

export function createIdentityClient(options: IdentityClientOptions = {}): IdentityClient {
  const fetchImpl = options.fetchImpl ?? fetch;
  const tokenStore = options.tokenStore ?? createNoopTokenStore();
  const logger: IdentityClientLogger | undefined = options.logger;
  const baseUrl = options.baseUrl ?? getFunctionsBaseUrl();

  function getSession(): IdentitySessionState | null {
    return tokenStore.get();
  }

  function setSession(value: IdentitySessionState | null): void {
    tokenStore.set(value);
  }

  function clearSession(): void {
    tokenStore.set(null);
  }

  async function maybeRefreshSession(): Promise<boolean> {
    const current = getSession();
    const refreshToken = current?.session?.refreshToken;
    if (!refreshToken) return false;

    try {
      const refreshed = await refresh();
      setSession({
        session: refreshed.session,
        user: refreshed.user,
        provider: refreshed.provider
      });
      return true;
    } catch {
      clearSession();
      if (options.onAuthFailure) {
        await options.onAuthFailure();
      }
      return false;
    }
  }

  async function request<T>(
    method: string,
    path: string,
    body?: unknown,
    requestOptions?: RequestOptions
  ): Promise<T> {
    const url = joinUrl(baseUrl, path);
    const started = performance.now();

    const headers: Record<string, string> = {
      accept: "application/json",
      ...(requestOptions?.headers ?? {})
    };

    if (body !== undefined) {
      headers["content-type"] = "application/json";
    }

    const current = getSession();
    const accessToken = current?.session?.accessToken;
    if (!requestOptions?.skipAuth && accessToken) {
      headers.authorization = `Bearer ${accessToken}`;
    }

    const init: FetchInit = {
      method,
      headers,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {})
    };

    try {
      const res = await fetchImpl(url, init);
      const parsed = await readJsonSafe(res);
      const ms = Math.max(0, Math.round(performance.now() - started));

      if (!res.ok) {
        if (
          res.status === 401 &&
          requestOptions?.retryOnAuthFailure !== false &&
          !requestOptions?.skipAuth &&
          (await maybeRefreshSession())
        ) {
          return request<T>(method, path, body, {
            ...requestOptions,
            retryOnAuthFailure: false
          });
        }

        logger?.({
          method,
          path,
          url,
          status: res.status,
          ms,
          ok: false,
          ...(body !== undefined ? { requestBody: body } : {}),
          ...(parsed !== undefined ? { responseBody: parsed } : {})
        });

        throw toError(res.status, parsed);
      }

      logger?.({
        method,
        path,
        url,
        status: res.status,
        ms,
        ok: true,
        ...(body !== undefined ? { requestBody: body } : {}),
        ...(parsed !== undefined ? { responseBody: parsed } : {})
      });

      return unwrapEnvelope<T>(res.status, parsed);
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
          ...(body !== undefined ? { requestBody: body } : {}),
          responseBody: null,
          ...(err instanceof Error ? { errorMessage: err.message } : { errorMessage: String(err) })
        });
      }

      throw err;
    }
  }

  async function login(req: AuthLoginRequest): Promise<AuthLoginResponse> {
    const result = await request<AuthLoginResponse>("POST", "/auth-login", req, {
      headers: { "x-request-id": "identity-client-login" },
      skipAuth: true,
      retryOnAuthFailure: false
    });

    setSession({
      session: result.session,
      user: result.user,
      provider: result.provider
    });

    return result;
  }

  async function register(req: {
    email: string;
    password: string;
    displayName?: string;
  }): Promise<AuthRegisterResponse> {
    const result = await request<AuthRegisterResponse>("POST", "/auth-register", req, {
      headers: { "x-request-id": "identity-client-register" },
      skipAuth: true,
      retryOnAuthFailure: false
    });

    setSession({
      session: result.session,
      user: result.user,
      provider: result.provider
    });

    return result;
  }

  async function refresh(): Promise<AuthRefreshResponse> {
    const current = getSession();
    const refreshToken = current?.session?.refreshToken;
    if (!refreshToken) {
      throw new IdentityClientError({
        status: 401,
        code: "UNAUTHORIZED",
        message: "No refresh token available"
      });
    }

    const result = await request<AuthRefreshResponse>(
      "POST",
      "/auth-refresh",
      { refreshToken },
      {
        headers: { "x-request-id": "identity-client-refresh" },
        skipAuth: true,
        retryOnAuthFailure: false
      }
    );

    setSession({
      session: result.session,
      user: result.user,
      provider: result.provider
    });

    return result;
  }

  async function logout(req?: AuthLogoutRequest): Promise<void> {
    const current = getSession();
    const refreshToken = req?.refreshToken ?? current?.session?.refreshToken;

    try {
      await request<unknown>(
        "POST",
        "/auth-logout",
        refreshToken ? { refreshToken } : {},
        {
          headers: { "x-request-id": "identity-client-logout" },
          retryOnAuthFailure: false
        }
      );
    } finally {
      clearSession();
    }
  }

  async function getMe(): Promise<MeResponse> {
    const result = await request<MeResponse>("GET", "/me", undefined, {
      headers: { "x-request-id": "identity-client-me" }
    });

    const current = getSession();
    setSession({
      ...(current?.session ? { session: current.session } : {}),
      user: result.user,
      ...(current?.provider ? { provider: current.provider } : {})
    });

    return result;
  }

  async function listUsers(): Promise<AuthUserProfile[]> {
    const result = await request<{ users: AuthUserProfile[] }>("GET", "/admin-users", undefined, {
      headers: { "x-request-id": "identity-client-admin-users-list" }
    });

    return result.users;
  }

  async function getUser(id: string): Promise<AuthUserProfile> {
    const result = await request<{ user: AuthUserProfile }>(
      "GET",
      `/admin-users/${encodeURIComponent(id)}`,
      undefined,
      {
        headers: { "x-request-id": "identity-client-admin-users-get" }
      }
    );

    return result.user;
  }

  async function createUser(req: AdminCreateUserRequest): Promise<AuthUserProfile> {
    const result = await request<{ user: AuthUserProfile }>("POST", "/admin-users", req, {
      headers: { "x-request-id": "identity-client-admin-users-create" }
    });

    return result.user;
  }

  async function updateUser(id: string, req: AdminUpdateUserRequest): Promise<AuthUserProfile> {
    const result = await request<{ user: AuthUserProfile }>(
      "PATCH",
      `/admin-users/${encodeURIComponent(id)}`,
      req,
      {
        headers: { "x-request-id": "identity-client-admin-users-patch" }
      }
    );

    return result.user;
  }

  async function deleteUser(id: string): Promise<void> {
    await request<unknown>("DELETE", `/admin-users/${encodeURIComponent(id)}`, undefined, {
      headers: { "x-request-id": "identity-client-admin-users-delete" }
    });
  }

  return {
    login,
    register,
    refresh,
    logout,
    getMe,
    listUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getSession,
    setSession,
    clearSession
  };
}
