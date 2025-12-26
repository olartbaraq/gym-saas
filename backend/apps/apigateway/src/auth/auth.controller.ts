import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Logger,
  LoggerService,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Public } from './decorators/public.decorator';
import type { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';

// Extend Express Request to include cookies
interface RequestWithCookies extends Request {
  cookies: { [key: string]: string };
}

// Extend Express Request to include user from Passport
interface RequestWithUser extends Request {
  user: {
    providerId: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

@Controller('auth')
export class AuthController {
  private readonly logger: LoggerService = new Logger(AuthController.name);
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Helper to set secure HTTP-only cookies
   */
  private setCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    // Access token - HTTP-only, short-lived
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
    });

    // Refresh token - HTTP-only, long-lived
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });
  }

  @Get('google')
  @Public()
  @UseGuards(AuthGuard('google'))
  goggleAuth() {}

  @Get('google/callback')
  @Public()
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    try {
      const tokens = await this.authService.googleLogin(req.user);
      const appUrl = this.configService.get<string>('APP_URL');

      this.logger.log({
        tag: 'GoogleCallback',
        userId: tokens.user.id,
      });

      // Set HTTP-only cookies
      this.setCookies(res, tokens.accessToken, tokens.refreshToken);

      // Redirect to success page
      res.redirect(`${appUrl}/auth/success`);
    } catch (error) {
      this.logger.error('Google callback error', error);
      const appUrl = this.configService.get<string>('APP_URL');
      res.redirect(`${appUrl}/auth/error`);
    }
  }

  /**
   * Get current authenticated user
   * Uses the access_token from HTTP-only cookie
   */
  @Get('me')
  @Public()
  async getCurrentUser(@Req() req: RequestWithCookies) {
    const accessToken = req.cookies?.access_token;

    if (!accessToken) {
      throw new HttpException('Not authenticated', HttpStatus.UNAUTHORIZED);
    }

    try {
      const user = await this.authService.getUserFromToken(accessToken);
      return { user };
    } catch (error) {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  /**
   * Refresh access token using HTTP-only refresh_token cookie
   */
  @Post('refresh')
  @Public()
  async refreshToken(@Req() req: RequestWithCookies, @Res() res: Response) {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      // When using @Res(), must send response manually
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'No refresh token provided',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }

    try {
      const tokens = await this.authService.refreshAccessToken(refreshToken);

      // Set new HTTP-only cookies
      this.setCookies(res, tokens.accessToken, tokens.refreshToken);

      // Return user data (no tokens in response body)
      return res.status(HttpStatus.OK).json({ user: tokens.user });
    } catch (error) {
      this.logger.error('Refresh token error:', error);

      // Clear invalid cookies
      res.clearCookie('access_token', { path: '/' });
      res.clearCookie('refresh_token', { path: '/' });

      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Invalid refresh token',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }
  }

  /**
   * Check if user is authenticated (for frontend to verify session)
   */
  @Get('check')
  @Public()
  async checkAuth(@Req() req: RequestWithCookies) {
    const accessToken = req.cookies?.access_token;
    const refreshToken = req.cookies?.refresh_token;

    if (!accessToken && !refreshToken) {
      return { authenticated: false };
    }

    // If access token exists and is valid
    if (accessToken) {
      try {
        const user = await this.authService.getUserFromToken(accessToken);
        const { email, isActive, firstName, lastName, createdAt } = user;
        return {
          authenticated: true,
          user: { email, isActive, firstName, lastName, createdAt },
        };
      } catch {
        // Token expired, but we have refresh token
        if (refreshToken) {
          return { authenticated: false, canRefresh: true };
        }
      }
    }

    // Only refresh token exists
    if (refreshToken) {
      return { authenticated: false, canRefresh: true };
    }

    return { authenticated: false };
  }

  @Post('logout')
  @Public()
  @HttpCode(HttpStatus.OK)
  async logout(@Res() res: Response) {
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });
    res.json({ message: 'Logged out successfully' });
  }
}
