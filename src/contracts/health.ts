export type HealthResponse = {
  status: "ok" | "degraded";
  version: string;
  timestamp: string;
  build: {
    sha?: string;
    buildId?: string;
    node: string;
  };
  env: {
    authProvider?: string;
    postgres: {
      hasHost: boolean;
      hasDatabase: boolean;
      hasUser: boolean;
      hasPassword: boolean;
      hasPort: boolean;
      hasSslMode: boolean;
    };
    supabase: {
      hasUrl: boolean;
      hasAnonKey: boolean;
    };
    netlify: {
      context?: string;
      deployId?: string;
      siteId?: string;
    };
  };
  diagnostics?: {
    config: {
      ok: boolean;
      provider: string;
      issues: Array<{
        code: string;
        message: string;
        env?: string;
      }>;
    };
    checks?: {
      postgres?: {
        ok: boolean;
        latencyMs?: number;
        error?: string;
      };
    };
  };
};

