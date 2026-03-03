export default async function globalTeardown() {
  const harness = globalThis.__NETLIFY_DEV_HARNESS__;
  if (!harness) return;

  try {
    await harness.stop();
  } finally {
    globalThis.__NETLIFY_DEV_HARNESS__ = undefined;
  }
}

