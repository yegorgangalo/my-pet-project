import { ENV } from '@mandruy/common/const';
import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { MailModule } from './mail/mail.module';
import { TokenModule } from './token/token.module';
import { HttpCacheModule } from './http-cache/http-cache.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..', '..', 'static'),
    }),
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
    FilesModule,
  ],
})
export class AppModule {}
