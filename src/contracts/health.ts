export type HealthResponse = {
  status: "ok";
  version: string;
  timestamp: string;
  build: {
    sha?: string;
    buildId?: string;
    node: string;
  };
};
