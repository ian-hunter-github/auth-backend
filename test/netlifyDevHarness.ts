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

async function pickPort(preferred: number): Promise<number> {
  for (let p = preferred; p < preferred + 200; p++) {
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
  const staticPort = await pickPort(preferredStaticPort);

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

  let output = "";
  child.stdout.on("data", (d) => {
    output += d.toString();
  });
  child.stderr.on("data", (d) => {
    output += d.toString();
  });

  const baseUrl = `http://127.0.0.1:${proxyPort}`;

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
