export type GeneratedBuildInfo = {
  projectName: string;
  version: string;
  buildTime: string;
  sha?: string;
  shortSha?: string;
  buildId?: string;
  branch?: string;
  appEnv?: string;
  workPackage?: string;
  phase?: number | string;
  step?: string;
  description?: string;
};

export const GENERATED_BUILD_INFO: GeneratedBuildInfo = {
  projectName: "identity-backend-service",
  version: "0.1.0",
  buildTime: "1970-01-01T00:00:00.000Z",
  workPackage: "identity-backend",
  phase: 5,
  step: "5.5.3",
  description: "Environment handling, CI stabilization, and build metadata"
};
