import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class Mailer {
  constructor(private mailerService: MailerService) {}

  public async sendEmail({ email, accessToken }): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: 'noreply@nestjs.com',
        subject: 'Reset Password',
        text: 'Hi! We received a request to reset your password. Please click on the link below to proceed.',
        html: `<p>${process.env.CLIENT_URL}/resetpassword/${accessToken}</p>`,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
