import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    super();
  }

  getRequest(context: ExecutionContext) {
    // Check if this is a GraphQL context
    const type = context.getType<'http' | 'graphql'>();

    if (type === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      return gqlCtx.getContext().req;
    }

    // For HTTP/REST context, use the standard approach
    return context.switchToHttp().getRequest();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Check if this is a GraphQL context
    const type = context.getType<'http' | 'graphql'>();

    // For GraphQL, manually validate JWT (Passport doesn't work well with GraphQL)
    if (type === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      const { req } = gqlCtx.getContext();

      if (!req) {
        throw new UnauthorizedException('Request not found in GraphQL context');
      }

      // Extract token from cookie or Authorization header
      let token: string | null = null;

      if (req.cookies?.access_token) {
        token = req.cookies.access_token;
      } else if (req.headers?.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.substring(7);
      }

      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      try {
        const secret = this.configService.get<string>('JWT_SECRET');
        const payload = await this.jwtService.verifyAsync(token, {
          secret,
        });

        // Attach user to request (similar to Passport)
        req.user = {
          userId: payload.sub,
          email: payload.email,
          role: payload.role,
          gymId: payload.gymId,
          gymLocationId: payload.gymLocationId,
        };

        return true;
      } catch (error) {
        throw new UnauthorizedException('Invalid or expired token');
      }
    }

    // For REST/HTTP context, use Passport's authenticate
    return super.canActivate(context) as Promise<boolean>;
  }
}
