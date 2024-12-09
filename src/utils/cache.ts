import { Property } from '../types';

const CACHE_KEY = 'renthub_properties';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export function setCache<T>(key: string, data: T): void {
  const cacheItem: CacheItem<T> = {
    data,
    timestamp: Date.now(),
  };
  localStorage.setItem(key, JSON.stringify(cacheItem));
}

export function getCache<T>(key: string): T | null {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  const cacheItem: CacheItem<T> = JSON.parse(cached);
  const isExpired = Date.now() - cacheItem.timestamp > CACHE_DURATION;

  if (isExpired) {
    localStorage.removeItem(key);
    return null;
  }

  return cacheItem.data;
}

export function clearCache(key?: string): void {
  if (key) {
    localStorage.removeItem(key);
  } else {
    localStorage.removeItem(CACHE_KEY);
  }
}

export const propertyCache = {
  set: (properties: Property[]) => setCache(CACHE_KEY, properties),
  get: () => getCache<Property[]>(CACHE_KEY),
  clear: () => clearCache(CACHE_KEY),
};