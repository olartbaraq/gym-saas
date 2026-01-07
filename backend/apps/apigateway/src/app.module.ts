import { Module } from '@nestjs/common';
import { UsersModule } from './restapi/users/users.module';
import configuration from 'apps/auth/src/config/configuration';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './restapi/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UsersGraphQLModule } from './graphql/users/users-graphql.module';
import { GymsGraphQLModule } from './graphql/gyms/gyms-graphql.module';
import { GraphQLThrottlerGuard } from './common/guards/graphql-throttler.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    // GraphQL Configuration
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'apps/apigateway/src/schema.gql'),
      sortSchema: true,
      playground: false, // Disable deprecated Playground (has CSP issues)
      introspection: true, // Required for Apollo Studio Sandbox
      path: '/graphql', // Explicitly set GraphQL path
      context: ({ req, res }) => ({ req, res }),
      csrfPrevention: false,
      // Disable Apollo Server's built-in CSP headers
      plugins: [],
    }),
    // Rate limiting - 10 requests per 60 seconds per IP
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    UsersModule,
    AuthModule,
    UsersGraphQLModule,
    GymsGraphQLModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GraphQLThrottlerGuard,
    },
  ],
})
export class AppModule {}
