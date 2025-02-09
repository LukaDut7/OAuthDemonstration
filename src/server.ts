import 'reflect-metadata';
import { AppDataSource } from './config/ormconfig';
import { ENV } from './utils/env';
import { app } from './app';
import { Client } from './entities/Client';
import { User } from './entities/User';
import bcrypt from 'bcrypt';

async function startServer() {
  await AppDataSource.initialize();

  // Seed the OAuth client
  const clientRepo = AppDataSource.getRepository(Client);
  const existingClient = await clientRepo.findOne({
    where: { clientId: ENV.OAUTH_CLIENT_ID },
  });
  if (!existingClient) {
    const newClient = clientRepo.create({
      clientId: ENV.OAUTH_CLIENT_ID,
      redirectUri: ENV.OAUTH_CLIENT_REDIRECT_URI,
    });
    await clientRepo.save(newClient);
    console.log('Seeded OAuth Client:', newClient);
  }

  // Seed a test user
  const userRepo = AppDataSource.getRepository(User);
  let testUser = await userRepo.findOne({ where: { username: 'testuser' } });
  if (!testUser) {
    // We'll store a hashed password
    const hashedPassword = await bcrypt.hash('password', 10);
    testUser = userRepo.create({
      username: 'testuser',
      password: hashedPassword,
    });
    await userRepo.save(testUser);
    console.log('Seeded User:', testUser);
  }

  app.listen(ENV.PORT, () => {
    console.log(`Server started on http://localhost:${ENV.PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
