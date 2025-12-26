import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, Logger, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

/**
 * Custom extractor that tries to get JWT from:
 * 1. HTTP-only cookie (access_token)
 * 2. Authorization header (Bearer token) - fallback
 */
const extractJwtFromCookieOrHeader = (req: Request): string | null => {
  // First, try to extract from cookie
  if (req.cookies?.access_token) {
    return req.cookies.access_token;
  }

  // Fallback to Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger: LoggerService = new Logger(JwtStrategy.name);

  constructor(private configService: ConfigService) {
    super({
      // Use custom extractor that checks cookies first, then header
      jwtFromRequest: extractJwtFromCookieOrHeader,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      // Pass request to validate method
      passReqToCallback: false,
    });
  }

  async validate(payload: any): Promise<{ userId: number; email: string }> {
    this.logger.log('JwtStrategy validation completed', {
      tag: 'JwtStrategy Validation',
      userId: payload.sub,
    });
    return { userId: payload.sub, email: payload.email };
  }
}
