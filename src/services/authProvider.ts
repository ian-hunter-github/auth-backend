import type {
  AuthLoginRequest,
  AuthLoginResponse,
  AuthLogoutRequest,
  AuthRefreshRequest,
  AuthRefreshResponse,
  AuthRegisterRequest,
  AuthRegisterResponse,
  AuthUserProfile
} from "../contracts/auth.js";

export type CreateUserInput = {
  email: string;
  password: string;
  displayName?: string;
  roles?: string[];
};

export type UpdateUserInput = {
  displayName?: string;
  roles?: string[];
};

export type AuthProvider = {
  login: (req: AuthLoginRequest) => Promise<AuthLoginResponse>;
  register: (req: AuthRegisterRequest) => Promise<AuthRegisterResponse>;
  refresh: (req: AuthRefreshRequest) => Promise<AuthRefreshResponse>;
  logout: (accessToken: string, req?: AuthLogoutRequest) => Promise<void>;
  getUserFromToken: (token: string) => Promise<AuthUserProfile>;

  listUsers: () => Promise<AuthUserProfile[]>;
  getUserById: (id: string) => Promise<AuthUserProfile>;
  createUser: (input: CreateUserInput) => Promise<AuthUserProfile>;
  updateUser: (id: string, input: UpdateUserInput) => Promise<AuthUserProfile>;
  deleteUser: (id: string) => Promise<void>;
};

