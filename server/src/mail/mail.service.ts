import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendActivationMail(emailTo: string, activationLink: string) {
    this.mailerService.sendMail({
      to: emailTo,
      subject: 'Greeting from NestJS NodeMailer',
      //   template: '/email',
      //   context: {
      //     name: activationLink,
      //   },
      html: `
        <div>
        <h1>Follow link to activate your account:</h1>
        <a href="${activationLink}">${activationLink}</a>
        </div>
        `,
    });
  }
}
