/**
 * Simple in-memory cache for File Search stores
 * Reduces database queries and improves response times
 */

interface CachedStore {
  id: string;
  agentId: string;
  storeId: string;
  name: string;
  description: string | null;
  createdAt: Date;
  cachedAt: number;
}

class FileSearchStoreCache {
  private cache = new Map<string, CachedStore>();
  private readonly TTL = 1000 * 60 * 60; // 1 hour cache TTL

  /**
   * Get store from cache
   */
  get(agentId: string): CachedStore | null {
    const cached = this.cache.get(agentId);

    if (!cached) {
      return null;
    }

    // Check if cache entry has expired
    if (Date.now() - cached.cachedAt > this.TTL) {
      this.cache.delete(agentId);
      return null;
    }

    return cached;
  }

  /**
   * Set store in cache
   */
  set(store: Omit<CachedStore, 'cachedAt'>): void {
    this.cache.set(store.agentId, {
      ...store,
      cachedAt: Date.now(),
    });
  }

  /**
   * Clear cache entry for an agent
   */
  clear(agentId: string): void {
    this.cache.delete(agentId);
  }

  /**
   * Clear all cache entries
   */
  clearAll(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    };
  }
}

// Singleton instance
export const fileSearchStoreCache = new FileSearchStoreCache();
