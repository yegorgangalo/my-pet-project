import { ENV } from '@mandruy/common/const';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendActivationMail(emailTo: string, activateAccountKey: string) {
    try {
      const SERVER_URL = this.configService.get<string>(ENV.SERVER_URL);
      const fullActivationLink = `${SERVER_URL}/users/activate/${activateAccountKey}`;
      console.log('sendActivationMail:', { emailTo, fullActivationLink });
      const res = await this.mailerService.sendMail({
        to: emailTo,
        subject: 'Greeting from NestJS NodeMailer',
        //   template: '/email',
        //   context: {
        //     name: activationLink,
        //   },
        html: `
        <div>
        <h1>Follow link to activate your account:</h1>
        <a href="${fullActivationLink}">${fullActivationLink}</a>
        </div>
        `,
      });
      return res;
    } catch (err) {
      console.log('sendActivationMail error:', err);
      return err;
    }
    // return this.mailerService
    //   .sendMail({
    //     to: emailTo,
    //     subject: 'Greeting from NestJS NodeMailer',
    //     //   template: '/email',
    //     //   context: {
    //     //     name: activationLink,
    //     //   },
    //     html: `
    //     <div>
    //     <h1>Follow link to activate your account:</h1>
    //     <a href="${activationLink}">${activationLink}</a>
    //     </div>
    //     `,
    //   })
    //   .then(success => {
    //     console.log('success=', success);
    //   })
    //   .catch(err => {
    //     console.log('err=', err);
    //   });
  }
}
