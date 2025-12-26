import { Module } from '@nestjs/common';
import { GymsResolver } from './gyms.resolver';
import { GymsGraphQLService } from './gyms-graphql.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GYMS_PACKAGE_NAME } from '@app/common';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: GYMS_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: GYMS_PACKAGE_NAME,
          protoPath: join(__dirname, '../gyms.proto'),
          url: process.env.GYM_GRPC_URL || 'localhost:5001',
        },
      },
    ]),
  ],
  providers: [GymsResolver, GymsGraphQLService],
  exports: [GymsGraphQLService],
})
export class GymsGraphQLModule {}
