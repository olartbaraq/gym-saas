import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

// Load environment variables
config();

export default new DataSource({
  type: 'postgres',
  host: process.env.AUTH_DATABASE_HOST,
  port: parseInt(process.env.AUTH_DATABASE_PORT!),
  username: process.env.AUTH_DATABASE_USERNAME,
  password: process.env.AUTH_DATABASE_PASSWORD,
  database: process.env.AUTH_DATABASE_NAME,
  entities: [path.join(__dirname, '../**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, 'migrations/*{.ts,.js}')],
  synchronize: false, // Never use synchronize with migrations
  logging: true,
  ssl: { rejectUnauthorized: false },
});
