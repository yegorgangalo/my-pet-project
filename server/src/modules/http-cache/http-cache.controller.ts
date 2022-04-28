import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { HttpCacheService } from './http-cache.service';
import { CacheDto } from './cache.dto';

@Controller('http-cache')
export class HttpCacheController {
  constructor(private readonly httpCacheService: HttpCacheService) {}

  @Post()
  async addToCache<T>(@Body() cacheDto: CacheDto<T>) {
    await this.httpCacheService.addToCache(cacheDto);
  }

  @Get(':key')
  async getFromCache(@Res() res, @Param('key') key) {
    const value = await this.httpCacheService.getFromCache(key);
    console.log(value);
    return res.status(HttpStatus.OK).json(value);
  }
}
