import { spawn } from "node:child_process";
import net from "node:net";

type Harness = {
  baseUrl: string;
  pid: number;
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

async function pickPort(preferred: number, opts?: { exclude?: Set<number> }): Promise<number> {
  const exclude = opts?.exclude ?? new Set<number>();
  for (let p = preferred; p < preferred + 200; p++) {
    if (exclude.has(p)) continue;
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
    } catch {
      // netlify dev not ready yet
    }
    await sleep(250);
  }
  throw new Error("Timed out waiting for netlify dev");
}

type KillSignal = Parameters<typeof process.kill>[1];

function killProcessTree(pid: number, signal: KillSignal) {
  if (pid <= 0) return;

  if (process.platform !== "win32") {
    try {
      process.kill(-pid, signal);
      return;
    } catch {
      // fallback to direct kill
    }
  }

  try {
    process.kill(pid, signal);
  } catch {
    // process may already be gone
  }
}

export async function startNetlifyDev(): Promise<Harness> {
  const preferredProxyPort = Number(process.env.NETLIFY_DEV_PORT || "3999");
  const preferredStaticPort = Number(process.env.NETLIFY_STATIC_PORT || "4000");

  const proxyPort = await pickPort(preferredProxyPort);

  const staticPreferred =
    preferredStaticPort === proxyPort ? preferredStaticPort + 1 : preferredStaticPort;

  const staticPort = await pickPort(staticPreferred, { exclude: new Set([proxyPort]) });

  const cmd = process.platform === "win32" ? "npx.cmd" : "npx";
  const args = [
    "netlify",
    "dev",
    "--offline",
    "--no-open",
    "--port",
    String(proxyPort),
    "--staticServerPort",
    String(staticPort)
  ];

  // IMPORTANT:
  // Using stdio: "ignore" prevents PIPEWRAP/FILEHANDLE handles from keeping Vitest alive.
  // We rely on health polling for readiness and return a helpful error message on failure.
  const child = spawn(cmd, args, {
    stdio: "ignore",
    detached: process.platform !== "win32",
    env: {
      ...process.env,
      NETLIFY_DEV: "true",
      NETLIFY_TELEMETRY_DISABLED: "1"
    }
  });

  // Allow the parent process to exit even if a child lingers.
  // We still attempt to terminate it in globalTeardown.
  child.unref();

  const baseUrl = `http://localhost:${proxyPort}`;

  try {
    await waitForHealthy(baseUrl, 90000);
  } catch (err) {
    killProcessTree(child.pid ?? 0, "SIGTERM");
    const original = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Failed to start netlify dev.\n\nBase URL: ${baseUrl}\nProxy port: ${proxyPort}\nStatic port: ${staticPort}\n\nOriginal error: ${original}\n\nTip: run manually for logs:\n  npx netlify dev --offline --no-open --port ${proxyPort} --staticServerPort ${staticPort}\n`
    );
  }

  return {
    baseUrl,
    pid: child.pid ?? 0,
    stop: async () => {
      if (child.exitCode !== null) return;

      const pid = child.pid ?? 0;

      killProcessTree(pid, "SIGTERM");

      await new Promise<void>((resolve) => {
        child.once("exit", () => resolve());
        setTimeout(() => {
          killProcessTree(pid, "SIGKILL");
          resolve();
        }, 5000);
      });
    }
  };
}

