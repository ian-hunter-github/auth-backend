import { healthHandler } from "../handlers/healthHandler.js";

export function composeHealthHandler() {
  return healthHandler;
}

