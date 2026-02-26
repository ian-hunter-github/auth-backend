import { AppError } from "../lib/errors.js";
import type { AuthLoginRequest, AuthLoginResponse } from "../contracts/auth.js";

export async function login(req: AuthLoginRequest): Promise<AuthLoginResponse> {
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
    token: "fake-jwt-token.demo",
    user: {
      id: "user_demo_001",
      username: "demo",
      displayName: "Demo User",
      roles: ["user"]
    }
  };
}
