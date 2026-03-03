import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { startNetlifyDev } from "./netlifyDevHarness.js";

const STATE_PATH = resolve(process.cwd(), ".vitest-netlify-dev.json");

export default async function globalSetup() {
  process.env.AUTH_PROVIDER = "fake";
  process.env.SUPABASE_URL = process.env.SUPABASE_URL || "http://127.0.0.1:54321";
  process.env.SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "test_anon_key";

  const harness = await startNetlifyDev();
  process.env.TEST_BASE_URL = harness.baseUrl;

  writeFileSync(
    STATE_PATH,
    JSON.stringify(
      {
        baseUrl: harness.baseUrl,
        pid: harness.pid
      },
      null,
      2
    ),
    "utf8"
  );
}

