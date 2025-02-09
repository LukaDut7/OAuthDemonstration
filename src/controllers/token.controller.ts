import { Request, Response } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { Client } from '../entities/Client';
import { AuthorizationCode } from '../entities/AuthorizationCode';
import { RefreshToken } from '../entities/RefreshToken';
import { TokenService } from '../services/token.service';
import { nanoid } from 'nanoid';

export class TokenController {
  public static async postToken(req: Request, res: Response): Promise<void> {
    const { grant_type } = req.body;
    if (grant_type === 'authorization_code') {
      await TokenController.handleAuthorizationCodeGrant(req, res);
      return;
    } else if (grant_type === 'refresh_token') {
      await TokenController.handleRefreshTokenGrant(req, res);
      return;
    } else {
      res.status(400).json({ error: 'unsupported_grant_type' });
      return;
    }
  }

  private static async handleAuthorizationCodeGrant(req: Request, res: Response): Promise<void> {
    const { code, client_id, redirect_uri } = req.body;

    // Validate Client
    const clientRepo = AppDataSource.getRepository(Client);
    const client = await clientRepo.findOne({ where: { clientId: client_id } });
    if (!client || client.redirectUri !== redirect_uri) {
      res.status(400).json({ error: 'invalid_client_or_redirect_uri' });
      return;
    }

    // Validate Authorization Code
    const authCodeRepo = AppDataSource.getRepository(AuthorizationCode);
    const storedCode = await authCodeRepo.findOne({ where: { code } });
    if (!storedCode) {
      res.status(400).json({ error: 'invalid_grant' });
      return;
    }
    if (storedCode.clientId !== client_id || storedCode.redirectUri !== redirect_uri) {
      res.status(400).json({ error: 'invalid_grant' });
      return;
    }

    // Consume the code (one-time use)
    await authCodeRepo.remove(storedCode);

    // Create JWT access token
    const accessToken = await TokenService.createAccessToken({
      sub: String(storedCode.userId),
      client_id,
    });

    // Create a refresh token
    const refreshTokenValue = nanoid(32);
    const refreshTokenRepo = AppDataSource.getRepository(RefreshToken);
    const newRefreshToken = refreshTokenRepo.create({
      token: refreshTokenValue,
      userId: storedCode.userId,
      clientId: client_id,
    });
    await refreshTokenRepo.save(newRefreshToken);

    res.status(200).json({
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 15 * 60, // 15 minutes
      refresh_token: refreshTokenValue,
    });
    return;
  }

  private static async handleRefreshTokenGrant(req: Request, res: Response): Promise<void> {
    const { refresh_token, client_id } = req.body;
    if (!refresh_token || !client_id) {
      res.status(400).json({ error: 'invalid_request' });
      return;
    }

    const refreshTokenRepo = AppDataSource.getRepository(RefreshToken);
    const storedRefresh = await refreshTokenRepo.findOne({
      where: { token: refresh_token },
    });
    if (!storedRefresh) {
      res.status(400).json({ error: 'invalid_grant' });
      return;
    }

    if (storedRefresh.clientId !== client_id) {
      res.status(400).json({ error: 'invalid_grant' });
      return;
    }

    // Optionally check if it’s expired or revoked.
    // For simplicity, we assume it never expires.

    // Create new access token
    const accessToken = await TokenService.createAccessToken({
      sub: String(storedRefresh.userId),
      client_id,
    });

    res.status(200).json({
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 15 * 60,
      refresh_token: storedRefresh.token,
    });
    return;
  }
}
