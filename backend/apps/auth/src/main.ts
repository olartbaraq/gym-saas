import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AUTH_PACKAGE_NAME } from '@app/common';

// Load environment variables from .env file
config();

async function bootstrap() {
  const authGrpcPort = process.env.AUTH_GRPC_PORT || '5000';
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: join(__dirname, '../auth.proto'),
        package: AUTH_PACKAGE_NAME,
        url: `0.0.0.0:${authGrpcPort}`,
      },
    },
  );
  await app.listen();
  Logger.log(`Auth gRPC service started on port ${authGrpcPort}`);
}
bootstrap();
