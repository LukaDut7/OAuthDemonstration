import { Request, Response } from 'express';
import { AppDataSource } from '../config/ormconfig';
import { User } from '../entities/User';
import bcrypt from 'bcrypt';

export class AuthController {
  public static getLogin(req: Request, res: Response): void {
    // Basic HTML form
    res.send(`
      <h1>Login</h1>
      <form method="POST" action="/login">
        <div>
          <label>Username: <input name="username" /></label>
        </div>
        <div>
          <label>Password: <input type="password" name="password" /></label>
        </div>
        <button type="submit">Login</button>
      </form>
    `);
  }

  public static async postLogin(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).send('Missing username or password');
      return;
    }

    try {
      console.log({username})
      const userRepo = AppDataSource.getRepository(User);
      console.log({userRepo})
      const user = await userRepo.findOne({ where: { username } });
      console.log({user})
      if (!user) {
        res.status(401).send('Invalid username or password');
        return;
      }

      // Compare using bcrypt
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        res.status(401).send('Invalid username or password');
        return;
      }

      // Store user ID in session
      req.session.userId = user.id;

      const query = new URLSearchParams(req.query as any).toString();
      res.redirect(`/api/oauth/authorize?${query}`);
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }
}
