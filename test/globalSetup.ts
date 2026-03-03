import { startNetlifyDev } from "./netlifyDevHarness.js";

type Harness = Awaited<ReturnType<typeof startNetlifyDev>>;

declare global {
  var __NETLIFY_DEV_HARNESS__: Harness | undefined;
}

export default async function globalSetup() {
  // Force deterministic CI-safe provider for ALL unit/integration tests, regardless of developer env.
  process.env.AUTH_PROVIDER = "fake";
  process.env.NODE_ENV = "test";

  // JWT unit tests require this even if the Netlify functions don't.
  if (!process.env.AUTH_JWT_SECRET) {
    process.env.AUTH_JWT_SECRET = "test-auth-jwt-secret-0123456789abcdef0123456789abcdef";
  }

  const harness = await startNetlifyDev();
  globalThis.__NETLIFY_DEV_HARNESS__ = harness;

  process.env.TEST_BASE_URL = harness.baseUrl;
}

