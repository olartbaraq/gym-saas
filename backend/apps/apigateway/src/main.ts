import { config } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as passport from 'passport';

// Load environment variables from .env file
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security headers
  app.use(helmet());

  // Cookie parser for handling HTTP-only cookies
  app.use(cookieParser());

  const configService = app.get(ConfigService);

  const allowedOrigins =
    configService.get<string>('ALLOWED_ORIGINS')?.split(',') || [];

  const config = new DocumentBuilder()
    .setTitle('GymSaaS API Documentation')
    .setDescription(
      'GymSaaS is a comprehensive SaaS platform designed to streamline gym operations and enhance member experiences. The system provides powerful tools for managing memberships, scheduling classes, tracking workouts, handling payments, and facilitating communication between gym staff, trainers, and members. Built with scalability in mind, it supports multi-location gym chains while offering role-based access control for owners, administrators, staff, trainers, and members.',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: 'Please enter JWT token',
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token',
    )
    .addServer('/api/v1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Enable token persistence in Swagger
    },
  });

  app.setGlobalPrefix('api/v1');

  // CORS configuration
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.GATEWAY_PORT!);
  Logger.log(`API Gateway is running on port ${process.env.GATEWAY_PORT!}`);
}
bootstrap();
