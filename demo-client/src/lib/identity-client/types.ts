import type {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthLogoutRequest,
  AuthRefreshRequest,
  AuthRefreshResponse,
  AuthRegisterResponse,
  AuthSession,
  AuthUserProfile,
  AuthProviderId
} from "../../types/authTypes";
import type { MeResponse, UpdateMeRequest } from "../../types/meTypes";
import type {
  AdminCreateUserRequest,
  AdminUpdateUserRequest
} from "../../types/adminUsersTypes";

export type IdentitySessionState = {
  session?: AuthSession;
  user?: AuthUserProfile;
  provider?: AuthProviderId;
};

export type TokenStore = {
  get(): IdentitySessionState | null;
  set(value: IdentitySessionState | null): void;
};

export type IdentityClientLoggerEntry = {
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

export type IdentityClientLogger = (entry: IdentityClientLoggerEntry) => void;

export type IdentityClientOptions = {
  baseUrl?: string;
  fetchImpl?: typeof fetch;
  tokenStore?: TokenStore;
  onAuthFailure?: () => void | Promise<void>;
  logger?: IdentityClientLogger;
};

export type IdentityClient = {
  login(req: AuthLoginRequest): Promise<AuthLoginResponse>;
  register(req: {
    email: string;
    password: string;
    displayName?: string;
  }): Promise<AuthRegisterResponse>;
  refresh(): Promise<AuthRefreshResponse>;
  logout(req?: AuthLogoutRequest): Promise<void>;
  getMe(): Promise<MeResponse>;
  updateMe(req: UpdateMeRequest): Promise<MeResponse>;

  listUsers(): Promise<AuthUserProfile[]>;
  getUser(id: string): Promise<AuthUserProfile>;
  createUser(req: AdminCreateUserRequest): Promise<AuthUserProfile>;
  updateUser(id: string, req: AdminUpdateUserRequest): Promise<AuthUserProfile>;
  deleteUser(id: string): Promise<void>;
  revokeUserSessions(userId: string): Promise<void>;
  disableUser(userId: string): Promise<void>;
  enableUser(userId: string): Promise<void>;

  getSession(): IdentitySessionState | null;
  setSession(value: IdentitySessionState | null): void;
  clearSession(): void;
};

export type {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthLogoutRequest,
  AuthRefreshRequest,
  AuthRefreshResponse,
  AuthRegisterResponse,
  AuthSession,
  AuthUserProfile,
  AuthProviderId,
  MeResponse,
  UpdateMeRequest,
  AdminCreateUserRequest,
  AdminUpdateUserRequest
};
