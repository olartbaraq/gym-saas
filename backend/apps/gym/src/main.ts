import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { GymModule } from './gym.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GYMS_PACKAGE_NAME } from '@app/common/types/gyms';

// Load environment variables from .env file
config();

async function bootstrap() {
  const gymGrpcPort = process.env.GYM_GRPC_PORT || '5001';
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    GymModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: join(__dirname, '../gyms.proto'),
        package: GYMS_PACKAGE_NAME,
        url: `0.0.0.0:${gymGrpcPort}`,
      },
    },
  );
  await app.listen();
  Logger.log(`Gym gRPC service started on port ${gymGrpcPort}`);
}
bootstrap();
