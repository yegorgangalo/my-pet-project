import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CacheDto } from './cache.dto';

@Injectable()
export class HttpCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async addToCache<T>(cacheDto: CacheDto<T>) {
    await this.cacheManager.set(cacheDto.key, cacheDto.item);
  }

  async getFromCache(key: string) {
    const value = await this.cacheManager.get(key);
    return value;
  }

  async clearCache(cacheKey: string) {
    const keys: string[] = await this.cacheManager.store.keys();
    keys.forEach(key => {
      if (key.startsWith(cacheKey)) {
        this.cacheManager.del(key);
      }
    });
  }

  async resetCache() {
    await this.cacheManager.reset();
  }
}
