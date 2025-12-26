import { DataSource } from 'typeorm';
import { Gym } from './entities/gym.entity';

export const gymsProviders = [
  {
    provide: 'GYM_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Gym),
    inject: ['DATA_SOURCE'],
  },
];
