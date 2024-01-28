import WebStorageCache from 'web-storage-cache'

const cachePrefix = 'leevel_'

export function getCache(key, defaultValue = null) {
  const cacheKey = cachePrefix + key
  const wsCache = new WebStorageCache()
  const result = wsCache.get(cacheKey)
  return result != null ? result : defaultValue
}

export function setCache(key, value, expire = 86400) {
  const cacheKey = cachePrefix + key
  const wsCache = new WebStorageCache()
  wsCache.set(cacheKey, value, { exp: expire })
}

export function deleteCache(key) {
  const cacheKey = cachePrefix + key
  const wsCache = new WebStorageCache()
  wsCache.delete(cacheKey)
}
