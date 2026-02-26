# Repo Pack

Generated: 2026-02-26T09:23:51Z

## Goals

Develop auth backend service


---

## Tree

```
├── eslint.config.js
├── .github
│   └── workflows
│       └── ci.yml
├── .gitignore
├── netlify
│   └── functions
│       ├── auth-login.ts
│       └── health.ts
├── netlify.toml
├── package.json
├── .prettierignore
├── .prettierrc.json
├── src
│   ├── contracts
│   │   ├── auth.ts
│   │   └── health.ts
│   ├── lib
│   │   ├── body.ts
│   │   ├── errors.ts
│   │   ├── requestId.ts
│   │   └── response.ts
│   ├── meta.ts
│   └── services
│       ├── authService.ts
│       └── healthService.ts
├── test
│   ├── authLogin.test.ts
│   ├── health.test.ts
│   └── netlifyDevHarness.ts
├── tsconfig.json
└── vitest.config.ts

```

---

## File: eslint.config.js

```js
import js from "@eslint/js";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module"
      },
      globals: {
        ...globals.node
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin
    },
    rules: {
      ...tsPlugin.configs["recommended"].rules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_"
        }
      ],
      "no-console": "off"
    }
  },
  {
    ignores: ["dist/**", "node_modules/**", ".netlify/**", "coverage/**"]
  }
];

```

---

## File: .github/workflows/ci.yml

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test:run
        env:
          NETLIFY_DEV_PORT: "3999"

  deploy:
    if: github.ref == 'refs/heads/main'
    needs: [test]
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run build
      - run: npx netlify deploy --prod --dir=. --site "$NETLIFY_SITE_ID" --auth "$NETLIFY_AUTH_TOKEN"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

```

---

## File: .gitignore

```
# ============================================================
# React (Vite) + Supabase + Netlify — production-grade .gitignore
# ============================================================

# -----------------------------
# Secrets / Environment
# -----------------------------
.env
.env.*
!.env.example
!.env.sample
!.env.template

# Common secret files
*.pem
*.key
*.p12
*.pfx
*.crt
*.cer

# -----------------------------
# Dependencies
# -----------------------------
node_modules/
**/node_modules/

# Package manager caches (optional)
.pnpm-store/
**/.pnpm-store/
.npm/
**/.npm/
.yarn/
**/.yarn/
.yarn/cache/
.yarn/unplugged/
.yarn/build-state.yml
.yarn/install-state.gz

# -----------------------------
# Builds / Outputs
# -----------------------------
dist/
**/dist/
build/
**/build/
out/
**/out/

# Vite cache
.vite/
**/.vite/

# Coverage
coverage/
**/coverage/
*.lcov

# Next.js (if any app uses it)
.next/
**/.next/

# -----------------------------
# Logs
# -----------------------------
logs/
**/logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# -----------------------------
# OS / Editor / IDE
# -----------------------------
.DS_Store
Thumbs.db
*.swp
*.swo

.idea/
**/.idea/

.vscode/*
!.vscode/settings.json
!.vscode/extensions.json
!.vscode/launch.json
!.vscode/tasks.json

# -----------------------------
# TypeScript
# -----------------------------
*.tsbuildinfo

# -----------------------------
# Netlify
# -----------------------------
# Netlify local dev folder & state
.netlify/
**/.netlify/

# Netlify functions build artifacts (sometimes created by tooling)
.netlify/functions-serve/
.netlify/state.json

# -----------------------------
# Supabase
# -----------------------------
# Supabase CLI temp/state (common)
supabase/.temp/
supabase/.branches/
supabase/.cache/
supabase/.history/

# If you use local Supabase (Docker) these can appear
supabase/docker/
supabase/.env
supabase/.env.*
!supabase/.env.example

# Supabase generated types (choose one approach)
# If you generate types into your repo AND want to commit them, remove these lines.
supabase/types/
supabase/generated/

# -----------------------------
# Local tooling / scripts
# -----------------------------
.tmp/
.temp/
.cache/
**/.tmp/
**/.temp/
**/.cache/

# Direnv
.envrc
.direnv/

# Just / task runners (sometimes create state)
.justfile.local
.just/

# -----------------------------
# Test / E2E frameworks
# -----------------------------
# Playwright
playwright-report/
**/playwright-report/
test-results/
**/test-results/

# Cypress
cypress/videos/
cypress/screenshots/

# -----------------------------
# Misc
# -----------------------------
# Storybook
storybook-static/
**/storybook-static/

# Local certificates
certs/
**/certs/

aichat_admin/
```

---

## File: netlify/functions/auth-login.ts

```ts
import type { Handler } from "@netlify/functions";
import { getOrCreateRequestId } from "../../src/lib/requestId.js";
import { parseJsonBody } from "../../src/lib/body.js";
import { jsonOk, requireMethod, toErrorResponse } from "../../src/lib/response.js";
import type { AuthLoginRequest } from "../../src/contracts/auth.js";
import { login } from "../../src/services/authService.js";

export const handler: Handler = async (event) => {
  const requestId = getOrCreateRequestId(event.headers || {});
  try {
    requireMethod(event.httpMethod, ["POST"]);
    const req = parseJsonBody<AuthLoginRequest>(event.body);
    const data = await login(req);
    return jsonOk(200, requestId, data);
  } catch (err) {
    return toErrorResponse(requestId, err);
  }
};

```

---

## File: netlify/functions/health.ts

```ts
import type { Handler } from "@netlify/functions";
import { getOrCreateRequestId } from "../../src/lib/requestId.js";
import { jsonOk, requireMethod, toErrorResponse } from "../../src/lib/response.js";
import { getHealth } from "../../src/services/healthService.js";

export const handler: Handler = async (event) => {
  const requestId = getOrCreateRequestId(event.headers || {});
  try {
    requireMethod(event.httpMethod, ["GET"]);
    const data = getHealth();
    return jsonOk(200, requestId, data);
  } catch (err) {
    return toErrorResponse(requestId, err);
  }
};

```

---

## File: netlify.toml

```
[build]
  functions = "netlify/functions"

[functions]
  node_bundler = "esbuild"

[dev]
  framework = "#static"
  functions = "netlify/functions"
  port = 3999
  autoLaunch = false

```

---

## File: package.json

```json
{
  "name": "identity-backend-service",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=20"
  },
  "scripts": {
    "dev": "netlify dev",
    "build": "netlify functions:build",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "lint": "eslint .",
    "format": "prettier --write .",
    "test": "vitest",
    "test:run": "vitest run",
    "ci": "npm run lint && npm run typecheck && npm run test:run"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.0",
    "@netlify/functions": "^2.8.0",
    "@types/node": "^22.10.2",
    "@typescript-eslint/eslint-plugin": "^8.10.0",
    "@typescript-eslint/parser": "^8.10.0",
    "eslint": "^9.9.0",
    "eslint-config-prettier": "^9.1.0",
    "globals": "^15.9.0",
    "netlify-cli": "^18.0.0",
    "prettier": "^3.3.3",
    "typescript": "^5.6.3",
    "vitest": "^2.1.8"
  }
}

```

---

## File: .prettierignore

```
dist/
node_modules/
.netlify/
coverage/

```

---

## File: .prettierrc.json

```json
{
  "singleQuote": false,
  "semi": true,
  "trailingComma": "all",
  "printWidth": 100
}

```

---

## File: src/contracts/auth.ts

```ts
export type AuthLoginRequest = {
  username: string;
  password: string;
};

export type AuthUserProfile = {
  id: string;
  username: string;
  displayName: string;
  roles: string[];
};

export type AuthLoginResponse = {
  token: string;
  user: AuthUserProfile;
};

```

---

## File: src/contracts/health.ts

```ts
export type HealthResponse = {
  status: "ok";
  version: string;
  timestamp: string;
  build: {
    sha?: string;
    buildId?: string;
    node: string;
  };
};

```

---

## File: src/lib/body.ts

```ts
import { AppError } from "./errors.js";

export function parseJsonBody<T>(raw: string | null | undefined): T {
  if (!raw || raw.trim().length === 0) {
    throw new AppError("Missing JSON body", { code: "BAD_REQUEST", status: 400 });
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new AppError("Invalid JSON body", { code: "BAD_REQUEST", status: 400 });
  }
}

```

---

## File: src/lib/errors.ts

```ts
export type ErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly status: number;
  public readonly details?: unknown;

  constructor(message: string, opts: { code: ErrorCode; status: number; details?: unknown }) {
    super(message);
    this.name = "AppError";
    this.code = opts.code;
    this.status = opts.status;
    this.details = opts.details;
  }
}

export function isAppError(err: unknown): err is AppError {
  return err instanceof AppError;
}

```

---

## File: src/lib/requestId.ts

```ts
import crypto from "node:crypto";

export const REQUEST_ID_HEADER = "x-request-id";
export const CORRELATION_ID_HEADER = "x-correlation-id";

export function getOrCreateRequestId(headers: Record<string, string | undefined>) {
  const existing =
    headers[REQUEST_ID_HEADER] ||
    headers[REQUEST_ID_HEADER.toLowerCase()] ||
    headers[CORRELATION_ID_HEADER] ||
    headers[CORRELATION_ID_HEADER.toLowerCase()];

  return existing && existing.trim().length > 0 ? existing : crypto.randomUUID();
}

```

---

## File: src/lib/response.ts

```ts
import type { HandlerResponse } from "@netlify/functions";
import { AppError, isAppError } from "./errors.js";
import { REQUEST_ID_HEADER } from "./requestId.js";

export type SuccessEnvelope<T> = {
  ok: true;
  requestId: string;
  data: T;
};

export type ErrorEnvelope = {
  ok: false;
  requestId: string;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export function jsonOk<T>(statusCode: number, requestId: string, data: T): HandlerResponse {
  const body: SuccessEnvelope<T> = { ok: true, requestId, data };
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
      [REQUEST_ID_HEADER]: requestId
    },
    body: JSON.stringify(body)
  };
}

export function jsonError(
  statusCode: number,
  requestId: string,
  code: string,
  message: string,
  details?: unknown
): HandlerResponse {
  const body: ErrorEnvelope = {
    ok: false,
    requestId,
    error: {
      code,
      message,
      ...(details === undefined ? {} : { details })
    }
  };
  return {
    statusCode,
    headers: {
      "content-type": "application/json; charset=utf-8",
      [REQUEST_ID_HEADER]: requestId
    },
    body: JSON.stringify(body)
  };
}

export function toErrorResponse(requestId: string, err: unknown): HandlerResponse {
  if (isAppError(err)) {
    return jsonError(err.status, requestId, err.code, err.message, err.details);
  }

  const msg = err instanceof Error ? err.message : "Unknown error";
  return jsonError(500, requestId, "INTERNAL_ERROR", msg);
}

export function requireMethod(actual: string | undefined, allowed: string[]) {
  const m = (actual || "").toUpperCase();
  if (!allowed.includes(m)) {
    throw new AppError(`Method ${m || "UNKNOWN"} not allowed`, {
      code: "BAD_REQUEST",
      status: 405,
      details: { allowed }
    });
  }
}

```

---

## File: src/meta.ts

```ts
export const PROJECT = {
  name: "identity-backend-service",
  version: "0.1.0"
};

export function getBuildInfo() {
  const sha =
    process.env.GITHUB_SHA ||
    process.env.NETLIFY_COMMIT_REF ||
    process.env.COMMIT_REF ||
    undefined;

  const buildId = process.env.GITHUB_RUN_ID || process.env.BUILD_ID || undefined;

  return {
    sha,
    buildId,
    node: process.version
  };
}

```

---

## File: src/services/authService.ts

```ts
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

```

---

## File: src/services/healthService.ts

```ts
import { PROJECT, getBuildInfo } from "../meta.js";
import type { HealthResponse } from "../contracts/health.js";

export function getHealth(): HealthResponse {
  return {
    status: "ok",
    version: PROJECT.version,
    timestamp: new Date().toISOString(),
    build: getBuildInfo()
  };
}

```

---

## File: test/authLogin.test.ts

```ts
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { startNetlifyDev } from "./netlifyDevHarness.js";

let harness: Awaited<ReturnType<typeof startNetlifyDev>>;

beforeAll(async () => {
  harness = await startNetlifyDev();
});

afterAll(async () => {
  await harness.stop();
});

describe("POST /.netlify/functions/auth-login", () => {
  it("rejects invalid credentials", async () => {
    const res = await fetch(`${harness.baseUrl}/.netlify/functions/auth-login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "test-auth-401"
      },
      body: JSON.stringify({ username: "demo", password: "bad" })
    });

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe("UNAUTHORIZED");
  });

  it("accepts demo/letmein", async () => {
    const res = await fetch(`${harness.baseUrl}/.netlify/functions/auth-login`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "test-auth-200"
      },
      body: JSON.stringify({ username: "demo", password: "letmein" })
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.data.user.username).toBe("demo");
  });
});

```

---

## File: test/health.test.ts

```ts
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { startNetlifyDev } from "./netlifyDevHarness.js";

let harness: Awaited<ReturnType<typeof startNetlifyDev>>;

beforeAll(async () => {
  harness = await startNetlifyDev();
});

afterAll(async () => {
  await harness.stop();
});

describe("GET /.netlify/functions/health", () => {
  it("returns ok envelope", async () => {
    const res = await fetch(`${harness.baseUrl}/.netlify/functions/health`, {
      headers: { "x-request-id": "test-health-001" }
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("x-request-id")).toBe("test-health-001");

    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.requestId).toBe("test-health-001");
    expect(body.data.status).toBe("ok");
  });
});

```

---

## File: test/netlifyDevHarness.ts

```ts
import { spawn } from "node:child_process";
import net from "node:net";

type Harness = {
  baseUrl: string;
  stop: () => Promise<void>;
};

async function isPortFree(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.on("error", () => resolve(false));
    server.listen(port, "127.0.0.1", () => {
      server.close(() => resolve(true));
    });
  });
}

async function pickPort(preferred: number): Promise<number> {
  for (let p = preferred; p < preferred + 50; p++) {
    if (await isPortFree(p)) return p;
  }
  throw new Error(`No free port found near ${preferred}`);
}

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

async function waitForHealthy(baseUrl: string, timeoutMs: number) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${baseUrl}/.netlify/functions/health`);
      if (res.ok) return;
    } catch {}
    await sleep(250);
  }
  throw new Error("Timed out waiting for netlify dev");
}

export async function startNetlifyDev(): Promise<Harness> {
  const preferred = Number(process.env.NETLIFY_DEV_PORT || "3999");
  const port = await pickPort(preferred);

  const child = spawn(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["netlify", "dev", "--offline", "--port", String(port), "--no-open"],
    {
      stdio: "pipe",
      env: { ...process.env, NETLIFY_DEV: "true" }
    }
  );

  const baseUrl = `http://127.0.0.1:${port}`;
  await waitForHealthy(baseUrl, 30000);

  return {
    baseUrl,
    stop: async () => {
      if (child.killed) return;
      await new Promise<void>((resolve) => {
        child.once("exit", () => resolve());
        child.kill("SIGTERM");
        setTimeout(() => {
          if (!child.killed) child.kill("SIGKILL");
          resolve();
        }, 5000);
      });
    }
  };
}

```

---

## File: tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "module": "ES2022",
    "moduleResolution": "Bundler",
    "types": ["node"],
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "verbatimModuleSyntax": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "dist",
    "baseUrl": "."
  },
  "include": ["src/**/*.ts", "netlify/functions/**/*.ts", "test/**/*.ts"]
}

```

---

## File: vitest.config.ts

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
    testTimeout: 60000,
    hookTimeout: 60000
  }
});

```

---

