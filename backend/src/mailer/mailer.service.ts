import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailerService {
  constructor(private readonly mailer: NestMailerService) {}

  sendWelcomeEmail(to: string, username: string) {
    return this.mailer.sendMail({
      to,
      subject: 'Welcome! 🎉',
      template: 'welcome', 
      context: { username },
    });
  }

  sendResetPasswordEmail(to: string, resetLink: string) {
    return this.mailer.sendMail({
      to,
      subject: 'Reset your password',
      template: 'reset-password',
      context: { resetLink },
    });
  }
}