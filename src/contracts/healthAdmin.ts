import type { HealthResponse } from "./health.js";

export type HealthAdminResponse = HealthResponse & {
  envValues: {
    postgres: {
      host?: string;
      database?: string;
      user?: string;
      port?: string;
      sslMode?: string;
      passwordSet: boolean;
      configFingerprint: string;
    };
  };
};

