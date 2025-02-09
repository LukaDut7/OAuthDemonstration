import { Router } from 'express';
import { OAuthController } from '../controllers/oauth.controller';

const oauthRouter = Router();

oauthRouter.get('/authorize', OAuthController.getAuthorize);

export { oauthRouter };
