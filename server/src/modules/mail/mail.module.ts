import { ENV } from 'src/common/const';
import { Module, forwardRef } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { UsersModule } from '../users/users.module';
import { TokenModule } from 'src/modules/token/token.module';

@Module({
  imports: [
    TokenModule,
    forwardRef(() => UsersModule),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>(ENV.EMAIL_HOST),
          port: configService.get<string>(ENV.EMAIL_PORT),
          secure: false,
          auth: {
            user: configService.get<string>(ENV.EMAIL_USER),
            pass: configService.get<string>(ENV.EMAIL_PASSWORD),
          },
        },
        // defaults: {
        //   from: '<sendgrid_from_email_address>',
        // },
        // template: {
        //   dir: join(__dirname, './templates'),
        //   adapter: new HandlebarsAdapter(),
        //   options: {
        //     strict: true,
        //   },
        // },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
  controllers: [MailController],
})
export class MailModule {}
