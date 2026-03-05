export type HealthResponse = {
  status: "ok";
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
    netlify: {
      context?: string;
      deployId?: string;
      siteId?: string;
    };
  };
};

