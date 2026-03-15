export function testBaseUrl(): string {
  const url = process.env.TEST_BASE_URL || "";
  if (!url) {
    throw new Error("Missing TEST_BASE_URL (global setup did not run?)");
  }
  return url;
}
