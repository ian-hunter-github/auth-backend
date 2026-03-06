import { getEnv } from "../lib/env.js";
import type { HealthResponse } from "../contracts/health.js";
import { getBuildInfo, getProjectProgressInfo, PROJECT } from "../meta.js";

export async function getHealth(): Promise<HealthResponse> {
  const build = getBuildInfo();
  const project = getProjectProgressInfo();

  const authProvider = getEnv("AUTH_PROVIDER") || undefined;
  const context = getEnv("CONTEXT") || undefined;
  const deployId = getEnv("DEPLOY_ID") || undefined;
  const siteId = getEnv("SITE_ID") || undefined;

  return {
    status: "ok",
    version: PROJECT.version,
    timestamp: new Date().toISOString(),
    build: {
      version: build.version,
      buildTime: build.buildTime,
      node: build.node,
      ...(build.sha ? { sha: build.sha } : {}),
      ...(build.shortSha ? { shortSha: build.shortSha } : {}),
      ...(build.buildId ? { buildId: build.buildId } : {}),
      ...(build.branch ? { branch: build.branch } : {}),
      ...(build.appEnv ? { appEnv: build.appEnv } : {})
    },
    project: {
      ...(project.workPackage ? { workPackage: project.workPackage } : {}),
      ...(project.phase !== undefined ? { phase: project.phase } : {}),
      ...(project.step ? { step: project.step } : {}),
      ...(project.description ? { description: project.description } : {})
    },
    env: {
      ...(authProvider ? { authProvider } : {}),
      postgres: {
        hasHost: !!getEnv("PGHOST"),
        hasDatabase: !!getEnv("PGDATABASE"),
        hasUser: !!getEnv("PGUSER"),
        hasPassword: !!getEnv("PGPASSWORD"),
        hasPort: !!getEnv("PGPORT"),
        hasSslMode: !!getEnv("PGSSLMODE")
      },
      netlify: {
        ...(context ? { context } : {}),
        ...(deployId ? { deployId } : {}),
        ...(siteId ? { siteId } : {})
      }
    }
  };
}
