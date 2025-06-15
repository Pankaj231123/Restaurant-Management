// google-oauth2.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

@Injectable()
export class GoogleOauth2Service {
  private oAuth2Client;
  constructor(private config: ConfigService) {
    const clientId = this.config.get<string>('GOOGLE_CLIENT_ID');
    const clientSecret = this.config.get<string>('GOOGLE_CLIENT_SECRET');
    const refreshToken = this.config.get<string>('GOOGLE_REFRESH_TOKEN');

    if (!clientId || !clientSecret || !refreshToken) {
      throw new Error('Missing Google OAuth environment variables');
    }

    this.oAuth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      this.config.get<string>('GOOGLE_REDIRECT_URI'),
    );
    this.oAuth2Client.setCredentials({ refresh_token: refreshToken });
  }

  async getAccessToken(): Promise<string> {
    const res = await this.oAuth2Client.getAccessToken();
    const token = typeof res === 'string' ? res : res?.token;
    if (!token) throw new Error('Empty access token');
    return token;
  }
}
