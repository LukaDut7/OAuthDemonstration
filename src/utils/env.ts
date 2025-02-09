import * as dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || '8080',
  SESSION_SECRET: process.env.SESSION_SECRET || 'secret',
  JWT_ALGORITHM: process.env.JWT_ALGORITHM || 'RS256',
  PRIVATE_KEY_PEM: (process.env.PRIVATE_KEY_PEM || '').trim(),
  OAUTH_CLIENT_ID: process.env.OAUTH_CLIENT_ID || '',
  OAUTH_CLIENT_REDIRECT_URI: process.env.OAUTH_CLIENT_REDIRECT_URI || '',
};
