export const PROJECT = {
  name: "identity-backend-service",
  version: "0.1.0"
};

export function getBuildInfo() {
  const sha =
    process.env.GITHUB_SHA ||
    process.env.NETLIFY_COMMIT_REF ||
    process.env.COMMIT_REF ||
    undefined;

  const buildId = process.env.GITHUB_RUN_ID || process.env.BUILD_ID || undefined;

  return {
    sha,
    buildId,
    node: process.version
  };
}
