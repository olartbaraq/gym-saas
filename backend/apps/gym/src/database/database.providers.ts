import { DataSource } from 'typeorm';
import { join } from 'path';
import { Gym } from '../gyms/entities/gym.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.GYM_DATABASE_HOST!,
        port: parseInt(process.env.GYM_DATABASE_PORT!),
        username: process.env.GYM_DATABASE_USERNAME!,
        password: process.env.GYM_DATABASE_PASSWORD!,
        database: process.env.GYM_DATABASE_NAME!,
        entities: [Gym],
        migrations: [join(__dirname, 'migrations/*{.ts,.js}')],
        synchronize: false, // Use migrations instead of synchronize
        logging: true,
        ssl: { rejectUnauthorized: false },
      });

      return dataSource.initialize();
    },
  },
];

