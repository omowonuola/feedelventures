import { Module } from '@nestjs/common';
import { Mailer } from '../mail/mail.service.ts/nodemailer';

@Module({
  providers: [Mailer],
  exports: [Mailer],
})
export class MailModule {}
