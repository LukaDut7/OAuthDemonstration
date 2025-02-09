import { DataSource } from 'typeorm';
import { AuthorizationCode } from '../entities/AuthorizationCode';
import { Client } from '../entities/Client';
import { RefreshToken } from '../entities/RefreshToken';
import { User } from '../entities/User';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true, // For demo only; use migrations in production
  logging: false,
  entities: [AuthorizationCode, Client, RefreshToken, User],
});
