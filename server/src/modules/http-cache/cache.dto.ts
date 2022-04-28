import { ApiProperty } from '@nestjs/swagger';

export class CacheDto<T> {
  @ApiProperty({ example: 'users', description: 'cache key for users list' })
  readonly key: string;

  @ApiProperty({ example: 'user@gmail.com', description: 'any item to cache' })
  readonly item: T;
}
