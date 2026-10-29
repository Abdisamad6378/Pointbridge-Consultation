const CACHE_KEY = "pb_site_image_map";
const CACHE_VERSION = 2;
const CACHE_MAX_AGE_MS = 30 * 60_000;

type CachedPayload = {
  version: number;
  map: Record<string, string>;
  updatedAt: number;
};

/** Smaller URLs for faster hero / card loads (especially Unsplash). */
export function optimizeImageUrl(url: string, width = 1280) {
  if (!url) return url;
  if (url.includes("images.unsplash.com")) {
    const base = url.split("?")[0];
    return `${base}?w=${width}&q=75&auto=format&fit=crop`;
  }
  return url;
}

export function readCachedImageMap(): Record<string, string> | undefined {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return undefined;

    const parsed = JSON.parse(raw) as CachedPayload;
    if (parsed.version !== CACHE_VERSION || !parsed.map) return undefined;
    if (Date.now() - parsed.updatedAt > CACHE_MAX_AGE_MS) return undefined;

    return parsed.map;
  } catch {
    return undefined;
  }
}

export function clearCachedImageMap() {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    /* ignore */
  }
}

export function writeCachedImageMap(map: Record<string, string>) {
  try {
    const payload: CachedPayload = {
      version: CACHE_VERSION,
      map,
      updatedAt: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    /* storage full or unavailable */
  }
}

export function preloadImageUrls(urls: string[], width = 1280) {
  const unique = [...new Set(urls.filter(Boolean))];
  unique.forEach((url) => {
    const img = new Image();
    img.decoding = "async";
    img.src = optimizeImageUrl(url, width);
  });
}

export function preloadFirstImage(url: string, width = 1440) {
  if (!url) return;
  const img = new Image();
  img.fetchPriority = "high";
  img.decoding = "async";
  img.src = optimizeImageUrl(url, width);
}
