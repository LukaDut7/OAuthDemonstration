import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import bodyParser from 'body-parser';

const authRouter = Router();

authRouter.use(bodyParser.urlencoded({ extended: true }));

authRouter.get('/login', AuthController.getLogin);
authRouter.post('/login', AuthController.postLogin);

export { authRouter };
