/** Public site URL — set VITE_SITE_URL in Vercel for production. */
export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? "https://pointbridgeconsulting.com").replace(/\/$/, "");

export function absoluteUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
