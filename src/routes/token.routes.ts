import { Router } from 'express';
import { TokenController } from '../controllers/token.controller';
import bodyParser from 'body-parser';

const tokenRouter = Router();

tokenRouter.use(bodyParser.urlencoded({ extended: true }));
tokenRouter.post('/token', TokenController.postToken);

export { tokenRouter };
