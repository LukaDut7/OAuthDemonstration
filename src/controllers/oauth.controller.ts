import { Request, Response } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { Client } from '../entities/Client';
import { AuthorizationCode } from '../entities/AuthorizationCode';
import { nanoid } from 'nanoid';

export class OAuthController {
  public static async getAuthorize(req: Request, res: Response): Promise<void> {
    // Check if user is authenticated
    if (!req.session.userId) {
      // Save query in URL so we can get back here
      res.redirect('/login?' + new URLSearchParams(req.query as any));
      return;
    }

    const { response_type, client_id, redirect_uri, state } = req.query;
    if (response_type !== 'code') {
      res.status(400).send('Unsupported response_type');
      return;
    }

    // Validate Client
    const clientRepo = AppDataSource.getRepository(Client);
    const client = await clientRepo.findOne({ where: { clientId: client_id as string } });
    if (!client || client.redirectUri !== redirect_uri) {
      res.status(400).send('Invalid client or redirect URI');
      return;
    }

    // Generate authorization code
    const code = nanoid(16);
    const authCodeRepo = AppDataSource.getRepository(AuthorizationCode);

    const newAuthCode = authCodeRepo.create({
      code,
      clientId: client_id as string,
      redirectUri: redirect_uri as string,
      userId: req.session.userId, // from our login step
    });
    await authCodeRepo.save(newAuthCode);

    // Redirect with code (& optional state)
    let redirURL = `${redirect_uri}?code=${encodeURIComponent(code)}`;
    if (state) {
      redirURL += `&state=${encodeURIComponent(state as string)}`;
    }

    res.redirect(redirURL);
  }
}
