import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersGraphQLService } from './users-graphql.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_PACKAGE_NAME } from '@app/common';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          package: AUTH_PACKAGE_NAME,
          protoPath: join(__dirname, '../auth.proto'),
          url: process.env.AUTH_GRPC_URL || 'localhost:5000',
        },
      },
    ]),
  ],
  providers: [UsersResolver, UsersGraphQLService],
  exports: [UsersGraphQLService],
})
export class UsersGraphQLModule {}
