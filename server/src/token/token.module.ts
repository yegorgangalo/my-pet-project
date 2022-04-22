import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './token.service';
import { Token, TokenSchema } from './token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET_KEY'),
          // signOptions: {
          //   expiresIn: configService.get<string | number>('JWT_EXPIRATION_TIME'),
          // },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
