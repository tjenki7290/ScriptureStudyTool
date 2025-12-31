// server/utils/cache.js
class Cache {
    constructor() {
      this.store = new Map();
    }
  
    generateKey(type, reference, params = {}) {
      const paramString = Object.keys(params)
        .sort()
        .map(key => `${key}:${params[key]}`)
        .join('|');
      
      return `${type}:${reference}${paramString ? ':' + paramString : ''}`;
    }
  
    get(key) {
      const item = this.store.get(key);
      
      if (!item) {
        return null;
      }
      
      // Check if expired
      if (item.expiresAt && Date.now() > item.expiresAt) {
        this.store.delete(key);
        return null;
      }
      
      console.log(`✅ Cache HIT: ${key}`);
      return item.value;
    }
  
    set(key, value, ttl = 7 * 24 * 60 * 60 * 1000) {
      this.store.set(key, {
        value,
        expiresAt: ttl ? Date.now() + ttl : null,
        createdAt: Date.now()
      });
      
      console.log(`💾 Cache SET: ${key}`);
    }
  
    stats() {
      return {
        total: this.store.size,
        message: 'In-memory cache - resets on server restart'
      };
    }
  
    clear() {
      this.store.clear();
    }
  }
  
  const cache = new Cache();
  
  // Cleanup expired entries every hour
  setInterval(() => {
    const now = Date.now();
    let removed = 0;
    
    cache.store.forEach((item, key) => {
      if (item.expiresAt && now > item.expiresAt) {
        cache.store.delete(key);
        removed++;
      }
    });
    
    if (removed > 0) {
      console.log(`🧹 Cleaned up ${removed} expired entries`);
    }
  }, 60 * 60 * 1000);
  
  module.exports = cache;