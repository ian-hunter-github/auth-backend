import { spawn } from "node:child_process";
import net from "node:net";

type Harness = {
  baseUrl: string;
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
      stdio: "pipe",
      env: {
        ...process.env,
        NETLIFY_DEV: "true",
        NETLIFY_TELEMETRY_DISABLED: "1"
      }
    }
  );

  // Capture output for error reporting, but ensure we can fully close the pipes on teardown.
  let output = "";
  const onStdout = (d: Buffer) => {
    output += d.toString();
  };
  const onStderr = (d: Buffer) => {
    output += d.toString();
  };

  child.stdout?.on("data", onStdout);
  child.stderr?.on("data", onStderr);

  const baseUrl = `http://localhost:${proxyPort}`;

  try {
    await waitForHealthy(baseUrl, 90000);
  } catch (err) {
    try {
      child.kill("SIGTERM");
    } catch {
      // ignore: child may already be exiting
    }

    const original = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Failed to start netlify dev.\n\nBase URL: ${baseUrl}\nProxy port: ${proxyPort}\nStatic port: ${staticPort}\n\nOriginal error: ${original}\n\nnetlify dev output:\n${output}\n`
    );
  }

  return {
    baseUrl,
    stop: async () => {
      if (child.killed) return;

      // Important for Vitest "hanging-process" reporter:
      // close/destroy stdio pipes and remove listeners so they don't keep the process alive.
      try {
        child.stdout?.off("data", onStdout);
        child.stderr?.off("data", onStderr);
      } catch {
        // ignore
      }

      try {
        child.stdin?.end();
      } catch {
        // ignore
      }

      try {
        child.stdout?.destroy();
      } catch {
        // ignore
      }

      try {
        child.stderr?.destroy();
      } catch {
        // ignore
      }

      await new Promise<void>((resolve) => {
        child.once("exit", () => resolve());
        child.kill("SIGTERM");
        setTimeout(() => {
          if (!child.killed) child.kill("SIGKILL");
          resolve();
        }, 5000);
      });
    }
  };
}

