import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { GymsModule } from './gyms/gyms.module';

@Module({
  imports: [DatabaseModule, GymsModule],
  controllers: [],
  providers: [],
})
export class GymModule {}
