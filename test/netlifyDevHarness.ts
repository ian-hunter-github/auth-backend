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
  for (let p = preferred; p < preferred + 50; p++) {
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
    } catch {}
    await sleep(250);
  }
  throw new Error("Timed out waiting for netlify dev");
}

export async function startNetlifyDev(): Promise<Harness> {
  const preferred = Number(process.env.NETLIFY_DEV_PORT || "3999");
  const port = await pickPort(preferred);

  const child = spawn(
    process.platform === "win32" ? "npx.cmd" : "npx",
    ["netlify", "dev", "--offline", "--port", String(port), "--no-open"],
    {
      stdio: "pipe",
      env: { ...process.env, NETLIFY_DEV: "true" }
    }
  );

  const baseUrl = `http://127.0.0.1:${port}`;
  await waitForHealthy(baseUrl, 30000);

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
