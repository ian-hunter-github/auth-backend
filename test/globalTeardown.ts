import { startNetlifyDev } from "./netlifyDevHarness.js";

type Harness = Awaited<ReturnType<typeof startNetlifyDev>>;

declare global {
  var __NETLIFY_DEV_HARNESS__: Harness | undefined;
}

export default async function globalTeardown() {
  const h = globalThis.__NETLIFY_DEV_HARNESS__;
  if (!h) return;

  try {
    await h.stop();
  } finally {
    globalThis.__NETLIFY_DEV_HARNESS__ = undefined;
    delete process.env.TEST_BASE_URL;
  }
}

