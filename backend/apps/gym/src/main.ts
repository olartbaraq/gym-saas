import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { GymModule } from './gym.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { GYM } from '@app/common';

// Load environment variables from .env file
config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    GymModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: join(__dirname, '../gym.proto'),
        package: GYM,
      },
    },
  );
  await app.listen();
  Logger.log(`Gym service started successfully`);
}
bootstrap();
