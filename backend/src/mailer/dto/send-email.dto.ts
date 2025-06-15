export class SendEmailDto {
    email: string;
    type: 'welcome' | 'reset-password';
    username?: string;
    resetLink?: string;
  }