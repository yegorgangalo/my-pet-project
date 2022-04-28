import { ENV } from 'src/common/const';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { MailModule } from './mail/mail.module';
import { TokenModule } from './token/token.module';
import { HttpCacheModule } from './http-cache/http-cache.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>(ENV.MONGODB_URI),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    CommentsModule,
    AuthModule,
    RolesModule,
    MailModule,
    TokenModule,
    HttpCacheModule,
  ],
})
export class AppModule {}