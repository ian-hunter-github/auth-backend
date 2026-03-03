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
      // ignore: netlify dev may not be ready yet
    }
    await sleep(250);
  }
  throw new Error("Timed out waiting for netlify dev");
}

export async function startNetlifyDev(): Promise<Harness> {
  const preferredProxyPort = Number(process.env.NETLIFY_DEV_PORT || "3999");
  const preferredStaticPort = Number(process.env.NETLIFY_STATIC_PORT || "4000");

  const proxyPort = await pickPort(preferredProxyPort);

  const staticPreferred =
    preferredStaticPort === proxyPort ? preferredStaticPort + 1 : preferredStaticPort;

  const staticPort = await pickPort(staticPreferred, { exclude: new Set([proxyPort]) });

  // IMPORTANT:
  // - Use detached process group so globalTeardown can kill the whole tree via -pid.
  // - Use stdio: "ignore" so Vitest doesn't keep PIPEWRAP/PROCESSWRAP handles alive.
  const child = spawn(
    process.platform === "win32" ? "npx.cmd" : "npx",
    [
      "netlify",
      "dev",
      "--offline",
      "--no-open",
      "--port",
      String(proxyPort),
      "--staticServerPort",
      String(staticPort)
    ],
    {
      stdio: "ignore",
      detached: true,
      env: {
        ...process.env,
        NETLIFY_DEV: "true",
        NETLIFY_TELEMETRY_DISABLED: "1"
      }
    }
  );

  // Allow the parent (vitest) process to exit even if netlify is still running.
  child.unref();

  const pid = child.pid;
  if (!pid) {
    throw new Error("Failed to start netlify dev: missing child pid");
  }

  const baseUrl = `http://127.0.0.1:${proxyPort}`;

  try {
    await waitForHealthy(baseUrl, 90000);
  } catch (err) {
    const original = err instanceof Error ? err.message : String(err);

    // Best-effort kill of the process group.
    try {
      process.kill(-pid, "SIGTERM");
    } catch {
      try {
        process.kill(pid, "SIGTERM");
      } catch {
        // ignore
      }
    }

    throw new Error(
      `Failed to start netlify dev.\n\nBase URL: ${baseUrl}\nProxy port: ${proxyPort}\nStatic port: ${staticPort}\n\nOriginal error: ${original}\n`
    );
  }

  return {
    baseUrl,
    pid,
    stop: async () => {
      // Best-effort group shutdown (works on Unix when detached:true).
      try {
        process.kill(-pid, "SIGTERM");
      } catch {
        try {
          process.kill(pid, "SIGTERM");
        } catch {
          // ignore
        }
      }

      await sleep(1500);

      try {
        process.kill(-pid, "SIGKILL");
      } catch {
        try {
          process.kill(pid, "SIGKILL");
        } catch {
          // ignore
        }
      }
    }
  };
}

