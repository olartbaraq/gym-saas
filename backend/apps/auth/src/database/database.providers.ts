import { DataSource } from 'typeorm';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.AUTH_DATABASE_HOST!,
        port: parseInt(process.env.AUTH_DATABASE_PORT!),
        username: process.env.AUTH_DATABASE_USERNAME!,
        password: process.env.AUTH_DATABASE_PASSWORD!,
        database: process.env.AUTH_DATABASE_NAME!,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: false, // Use migrations instead of synchronize
        logging: true,
        ssl: { rejectUnauthorized: false },
      });

      return dataSource.initialize();
    },
  },
];
