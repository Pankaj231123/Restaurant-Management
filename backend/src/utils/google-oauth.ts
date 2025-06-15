import { google } from 'googleapis';
import * as dotenv from 'dotenv';
dotenv.config();

export async function getAccessToken(): Promise<string> {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground' // or your redirect URI
  );

  oAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  const accessTokenResponse = await oAuth2Client.getAccessToken();
  return accessTokenResponse?.token!;
  
}
