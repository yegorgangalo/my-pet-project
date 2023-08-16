import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpCacheController } from './http-cache.controller';
import { HttpCacheService } from './http-cache.service';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      ttl: 10,
      max: 5,
    }),
  ],
  controllers: [HttpCacheController],
  providers: [HttpCacheService],
  exports: [HttpCacheService],
})
export class HttpCacheModule {}
