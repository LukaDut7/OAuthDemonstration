import { SignJWT, importPKCS8 } from 'jose';
import { ENV } from '../utils/env';

export class TokenService {
  private static privateKeyPromise: Promise<CryptoKey> | null = null;

  private static getPrivateKey() {
    if (!this.privateKeyPromise) {
      // Ensure the key is trimmed to remove accidental whitespace
      const pk = ENV.PRIVATE_KEY_PEM.trim();
      this.privateKeyPromise = importPKCS8(pk, ENV.JWT_ALGORITHM);
    }
    return this.privateKeyPromise;
  }

  public static async createAccessToken(payload: Record<string, any>, expiresIn = '15m') {
    const privateKey = await this.getPrivateKey();
    return new SignJWT(payload)
      .setProtectedHeader({ alg: ENV.JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(privateKey);
  }
}
