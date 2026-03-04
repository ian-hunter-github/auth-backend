import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

function parseDotEnv(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  const lines = raw.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith("#")) continue;

    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();

    if (!key) continue;

    // strip surrounding quotes if present
    if (
      (value.startsWith('"') && value.endsWith('"') && value.length >= 2) ||
      (value.startsWith("'") && value.endsWith("'") && value.length >= 2)
    ) {
      value = value.slice(1, -1);
    }

    out[key] = value;
  }

  return out;
}

export function ensurePgEnvLoaded(): void {
  const shouldRun = (process.env.RUN_PG_TESTS || "").trim() === "1";
  if (!shouldRun) return;

  // If already set, do nothing.
  if (process.env.PGHOST && process.env.PGDATABASE && process.env.PGUSER && process.env.PGPASSWORD) return;

  const pgSystem = (process.env.PGSYSTEM || "neon").trim() || "neon";
  const root = process.cwd();
  const envPath = path.join(root, "postgres", "env", pgSystem, ".env");

  if (!existsSync(envPath)) {
    return;
  }

  const raw = readFileSync(envPath, "utf8");
  const parsed = parseDotEnv(raw);

  for (const [k, v] of Object.entries(parsed)) {
    if (!process.env[k] && v.trim().length > 0) {
      process.env[k] = v;
    }
  }
}

