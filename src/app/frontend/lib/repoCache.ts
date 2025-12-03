const DEFAULT_TTL_MS = 5 * 60 * 1000 // 5 minutes

type CacheEntry<T> = { expiry: number; value: T }

// Simple in-memory cache for client-side/shared use-case functions.
// Use key prefixes to invalidate related entries without nuking everything.
const cache = new Map<string, CacheEntry<unknown>>()

export function getCached<T>(key: string): T | null {
  const hit = cache.get(key)
  if (hit && hit.expiry > Date.now()) {
    return hit.value as T
  }
  return null
}

export function setCached<T>(key: string, value: T, ttlMs = DEFAULT_TTL_MS) {
  cache.set(key, { value, expiry: Date.now() + ttlMs })
}

export function invalidateCache(prefix?: string) {
  if (!prefix) {
    cache.clear()
    return
  }

  Array.from(cache.keys()).forEach((key) => {
    if (key.startsWith(prefix)) {
      cache.delete(key)
    }
  })
}

export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs = DEFAULT_TTL_MS
): Promise<T> {
  const hit = getCached<T>(key)
  if (hit) return hit

  const value = await fetcher()
  setCached(key, value, ttlMs)
  return value
}
