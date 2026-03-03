import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { startNetlifyDev } from "./netlifyDevHarness.js";

const STATE_PATH = resolve(process.cwd(), ".vitest-netlify-dev.json");

export default async function globalSetup() {
  process.env.AUTH_PROVIDER = process.env.AUTH_PROVIDER || "fake";

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

