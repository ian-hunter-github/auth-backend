export type HealthResponse = {
  status: "ok";
  version: string;
  timestamp: string;
  build: {
    version: string;
    buildTime: string;
    node: string;
    sha?: string;
    shortSha?: string;
    buildId?: string;
    branch?: string;
    appEnv?: string;
  };
  project: {
    workPackage?: string;
    phase?: number | string;
    step?: string;
    description?: string;
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
