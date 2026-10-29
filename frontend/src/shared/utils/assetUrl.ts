const BASE = (import.meta.env.VITE_API_BACKEND_URL ?? "").replace(/\/+$/, "");

export const assetUrl = (path?: string | null) => {
  if (!path) return null;
  if (/^(https?:)?\/\//.test(path) || path.startsWith("blob:")) return path;
  return `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;
};
