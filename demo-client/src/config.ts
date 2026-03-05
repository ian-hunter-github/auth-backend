export function getApiBaseUrl(): string {
  const raw = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
  const v = (raw || "").trim();
  // Default matches repo smoke/local patterns (Netlify dev commonly on 3999).
  return v || "http://localhost:3999";
}

export function getFunctionsBaseUrl(): string {
  const base = getApiBaseUrl().replace(/\/+$/, "");
  return `${base}/.netlify/functions`;
}
