import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Integration tests start a real Netlify Dev process; running files in parallel
    // can cause port collisions and flakiness. Keep deterministic: run serially.
    fileParallelism: false,
    sequence: {
      concurrent: false
    },
    poolOptions: {
      threads: {
        singleThread: true
      }
    },
    globalSetup: ["./test/globalSetup.ts"],
    globalTeardown: ["./test/globalTeardown.ts"],
    // Keep current defaults (explicitly), but give hooks room on slower machines.
    hookTimeout: 120_000,
    testTimeout: 120_000
  }
});

