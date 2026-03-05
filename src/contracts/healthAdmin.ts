export type HealthAdminResponse = {
  postgres: {
    // Connection and query timings observed from within the Netlify function runtime.
    connectMs: number;
    queryMs: number;

    // Lightweight counts to help debug production state.
    activeSessions: number;
    revokedSessions: number;
    failedLoginCountLastHour: number;

    // Existing config exposure (sanitised).
    passwordSet: boolean;
    configFingerprint: string;

    // These are optional because exactOptionalPropertyTypes is enabled.
    host?: string;
    database?: string;
    user?: string;
    port?: string;
    sslMode?: string;
  };
};

