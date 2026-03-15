import type { RequestContext } from "../../../security/requestContext.js";
import type {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthLogoutRequest,
  AuthRefreshRequest,
  AuthRefreshResponse,
  AuthRegisterRequest,
  AuthRegisterResponse,
  AuthUserProfile
} from "../../../contracts/auth.js";

export type CreateUserInput = {
  email: string;
  password: string;
  displayName?: string;
  roles?: string[];
  givenName?: string;
  familyName?: string;
  avatarUrl?: string;
  bio?: string;
  phoneNumber?: string;
  locale?: string;
  timezone?: string;
};

export type UpdateUserInput = {
  displayName?: string;
  roles?: string[];
  givenName?: string;
  familyName?: string;
  avatarUrl?: string;
  bio?: string;
  phoneNumber?: string;
  locale?: string;
  timezone?: string;
};

export type AuthProvider = {
  login: (req: AuthLoginRequest, ctx?: RequestContext) => Promise<AuthLoginResponse>;
  register: (req: AuthRegisterRequest, ctx?: RequestContext) => Promise<AuthRegisterResponse>;
  refresh: (req: AuthRefreshRequest, ctx?: RequestContext) => Promise<AuthRefreshResponse>;
  logout: (accessToken: string, req?: AuthLogoutRequest, ctx?: RequestContext) => Promise<void>;
  getUserFromToken: (token: string) => Promise<AuthUserProfile>;

  listUsers: () => Promise<AuthUserProfile[]>;
  getUserById: (id: string) => Promise<AuthUserProfile>;
  createUser: (input: CreateUserInput) => Promise<AuthUserProfile>;
  updateUser: (id: string, input: UpdateUserInput) => Promise<AuthUserProfile>;
  deleteUser: (id: string) => Promise<void>;
  revokeUserSessions: (userId: string) => Promise<void>;
  disableUser: (id: string) => Promise<void>;
  enableUser: (id: string) => Promise<void>;
};
