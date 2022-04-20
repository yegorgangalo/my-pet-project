import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET_KEY'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRATION_TIME'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
