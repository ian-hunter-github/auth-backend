import { GENERATED_BUILD_INFO } from "./generated/buildInfo.js";

export const PROJECT = {
  name: GENERATED_BUILD_INFO.projectName,
  version: GENERATED_BUILD_INFO.version
};

export type BuildInfo = {
  version: string;
  buildTime: string;
  node: string;
  sha?: string;
  shortSha?: string;
  buildId?: string;
  branch?: string;
  appEnv?: string;
};

export type ProjectProgressInfo = {
  workPackage?: string;
  phase?: number | string;
  step?: string;
  description?: string;
};

function pickFirst(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return undefined;
}

export function getBuildInfo(): BuildInfo {
  const sha = pickFirst(
    process.env.GITHUB_SHA,
    process.env.NETLIFY_COMMIT_REF,
    process.env.COMMIT_REF,
    GENERATED_BUILD_INFO.sha
  );

  const shortSha = pickFirst(
    sha ? sha.slice(0, 7) : undefined,
    GENERATED_BUILD_INFO.shortSha
  );

  const buildId = pickFirst(
    process.env.GITHUB_RUN_ID,
    process.env.BUILD_ID,
    process.env.DEPLOY_ID,
    GENERATED_BUILD_INFO.buildId
  );

  const branch = pickFirst(
    process.env.GITHUB_REF_NAME,
    process.env.BRANCH,
    process.env.HEAD,
    GENERATED_BUILD_INFO.branch
  );

  const appEnv = pickFirst(
    process.env.APP_ENV,
    process.env.CONTEXT,
    GENERATED_BUILD_INFO.appEnv
  );

  const buildTime = pickFirst(
    process.env.BUILD_TIME,
    GENERATED_BUILD_INFO.buildTime
  ) || new Date().toISOString();

  return {
    version: PROJECT.version,
    buildTime,
    node: process.version,
    ...(sha ? { sha } : {}),
    ...(shortSha ? { shortSha } : {}),
    ...(buildId ? { buildId } : {}),
    ...(branch ? { branch } : {}),
    ...(appEnv ? { appEnv } : {})
  };
}

export function getProjectProgressInfo(): ProjectProgressInfo {
  return {
    ...(GENERATED_BUILD_INFO.workPackage ? { workPackage: GENERATED_BUILD_INFO.workPackage } : {}),
    ...(GENERATED_BUILD_INFO.phase !== undefined ? { phase: GENERATED_BUILD_INFO.phase } : {}),
    ...(GENERATED_BUILD_INFO.step ? { step: GENERATED_BUILD_INFO.step } : {}),
    ...(GENERATED_BUILD_INFO.description ? { description: GENERATED_BUILD_INFO.description } : {})
  };
}
