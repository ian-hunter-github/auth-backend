import { PROJECT, getBuildInfo } from "../meta.js";
import type { HealthResponse } from "../contracts/health.js";

export function getHealth(): HealthResponse {
  return {
    status: "ok",
    version: PROJECT.version,
    timestamp: new Date().toISOString(),
    build: getBuildInfo()
  };
}
