import express from 'express';
import session from 'express-session';
import { authRouter } from './routes/auth.routes';
import { oauthRouter } from './routes/oauth.routes';
import { tokenRouter } from './routes/token.routes';
import { errorHandler } from './middlewares/errorHandler';
import { ENV } from './utils/env';

export const app = express();

// *************************
// Express Session
// *************************
app.use(
  session({
    secret: ENV.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

// *************************
// Routes
// *************************
app.use('/', authRouter);
app.use('/api/oauth', oauthRouter);
app.use('/api/oauth', tokenRouter);

// *************************
// Error Handler
// *************************
app.use(errorHandler);
