export function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL;
  const v = (raw || "").trim();

  // If not explicitly set, default to same-origin. In local dev, Vite proxies
  // "/.netlify/functions/*" to the backend (see vite.config.ts) to avoid CORS.
  if (!v) return window.location.origin;

  return v;
}

export function getFunctionsBaseUrl(): string {
  const base = getApiBaseUrl().replace(/\/+$/, "");
  return `${base}/.netlify/functions`;
}
