import { AppError } from "../lib/errors.js";
import type { AuthProvider } from "./authProvider.js";
import type { AuthLoginRequest, AuthLoginResponse, AuthUserProfile } from "../contracts/auth.js";

const DEMO_USER: AuthUserProfile = {
  id: "user_demo_001",
  username: "demo",
  displayName: "Demo User",
  roles: ["user"]
};

const FAKE_ACCESS_TOKEN = "fake-access-token.demo";

export const fakeAuthProvider: AuthProvider = {
  login: async (req: AuthLoginRequest): Promise<AuthLoginResponse> => {
    const username = (req.username || "").trim();
    const password = req.password || "";

    if (!username || !password) {
      throw new AppError("username and password are required", {
        code: "BAD_REQUEST",
        status: 400,
        details: { fields: ["username", "password"] }
      });
    }

    if (!(username === "demo" && password === "letmein")) {
      throw new AppError("Invalid credentials", { code: "UNAUTHORIZED", status: 401 });
    }

    return {
      provider: "fake",
      session: {
        accessToken: FAKE_ACCESS_TOKEN,
        tokenType: "bearer"
      },
      user: DEMO_USER
    };
  },

  getUserFromToken: async (token: string): Promise<AuthUserProfile> => {
    const t = (token || "").trim();
    if (!t) {
      throw new AppError("Missing token", { code: "UNAUTHORIZED", status: 401 });
    }
    if (t !== FAKE_ACCESS_TOKEN) {
      throw new AppError("Invalid token", { code: "UNAUTHORIZED", status: 401 });
    }
    return DEMO_USER;
  }
};
