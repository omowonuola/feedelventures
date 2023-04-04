import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(private mailerService: MailerService) {}

  public async sendEmail({ email, accessToken }): Promise<any> {
    try {
      const send = await this.mailerService.sendMail({
        to: email,
        from: `${process.env.AUTH_EMAIL}`,
        subject: 'Reset Password',
        text: '',
        html: `<p>Hi! We received a request to reset your password.</p><b>This link expires in 20min</b>.<p>Click <a href=
        ${process.env.CLIENT_URL}/passwordreset/${accessToken}>here</a> to proceed</p>`,
      });
      if (send) {
        return { status: 'SUCCESS', message: 'Email Sent' };
      }
    } catch (error) {
      this.logger.log(error);
    }
  }
}
