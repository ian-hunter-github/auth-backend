import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globalSetup: ["./test/globalSetup.ts"],
    globalTeardown: ["./test/globalTeardown.ts"],
    testTimeout: 120_000,
    hookTimeout: 120_000
  }
});

