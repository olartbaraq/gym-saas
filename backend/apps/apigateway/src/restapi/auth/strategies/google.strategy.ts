import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import {
  Injectable,
  Logger,
  LoggerService,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger: LoggerService = new Logger(GoogleStrategy.name);

  constructor(private configService: ConfigService) {
    super({
      clientID: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    this.logger.log('GoogleStrategy validation begins');

    const { id, name, emails } = profile;

    // Validate that we received an email from Google
    if (!emails?.length || !emails[0]?.value) {
      this.logger.error('No email provided from Google OAuth');
      return done(
        new UnauthorizedException('No email provided from Google'),
        undefined,
      );
    }

    const user = {
      providerId: id,
      email: emails[0].value,
      firstName: name?.givenName || '',
      lastName: name?.familyName || '',
    };

    this.logger.log('GoogleStrategy validation completed', {
      tag: 'GoogleStrategy Validation',
      userId: user.email,
    });

    done(null, user);
  }
}
