import { ENV } from '@mandruy/common/const/const';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  imports: [
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
})
export class MailModule {}
