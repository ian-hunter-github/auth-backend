import { startNetlifyDev } from "./netlifyDevHarness.js";

type Harness = Awaited<ReturnType<typeof startNetlifyDev>>;

declare global {
  var __NETLIFY_DEV_HARNESS__: Harness | undefined;
}

export default async function globalSetup() {
  // Unit tests should be deterministic and not depend on developer/prod env.
  // The JWT module reads AUTH_JWT_SECRET from env.
  if (!process.env.AUTH_JWT_SECRET) {
    process.env.AUTH_JWT_SECRET = "test-auth-jwt-secret-0123456789abcdef0123456789abcdef";
  }

  // Default to fake for CI-safe determinism unless a test explicitly overrides.
  if (!process.env.AUTH_PROVIDER) {
    process.env.AUTH_PROVIDER = "fake";
  }

  globalThis.__NETLIFY_DEV_HARNESS__ = await startNetlifyDev();
}

