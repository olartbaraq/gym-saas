import { Module } from '@nestjs/common';
import { GymsService } from './gyms.service';
import { GymsController } from './gyms.controller';
import { DatabaseModule } from '../database/database.module';
import { gymsProviders } from './gyms.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [GymsController],
  providers: [GymsService, ...gymsProviders],
  exports: [GymsService],
})
export class GymsModule {}
