import { existsSync, readFileSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";

const STATE_PATH = resolve(process.cwd(), ".vitest-netlify-dev.json");

async function sleep(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

function tryKill(pid: number, sig: NodeJS.Signals, group: boolean): boolean {
  try {
    process.kill(group ? -pid : pid, sig);
    return true;
  } catch {
    return false;
  }
}

export default async function globalTeardown() {
  if (!existsSync(STATE_PATH)) return;

  let pid: number | undefined;
  try {
    const raw = readFileSync(STATE_PATH, "utf8");
    const j = JSON.parse(raw) as { pid?: number };
    pid = j.pid;
  } catch {
    // ignore
  }

  try {
    unlinkSync(STATE_PATH);
  } catch {
    // ignore
  }

  if (!pid) return;

  // Try graceful shutdown first (process group, since we spawned detached:true).
  if (!tryKill(pid, "SIGTERM", true)) {
    tryKill(pid, "SIGTERM", false);
  }

  await sleep(1500);

  // If still alive, force kill.
  if (!tryKill(pid, "SIGKILL", true)) {
    tryKill(pid, "SIGKILL", false);
  }
}

