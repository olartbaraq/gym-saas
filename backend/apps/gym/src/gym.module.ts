import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { StaffModule } from './staff/staff.module';
import { ClassModule } from './class/class.module';

@Module({
  imports: [DatabaseModule, StaffModule, ClassModule],
  controllers: [],
  providers: [],
})
export class GymModule {}
