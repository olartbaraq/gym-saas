import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  LoggerService,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto, User } from '@app/common/types/auth';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../users/dto/login.dto';
import { UsersService } from '../users/users.service';
import {
  AuthProvider,
  UserRole,
} from 'apps/auth/src/users/entities/user.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private readonly logger: LoggerService = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const lowercaseEmail = email.toLowerCase();

    const user = await this.usersService.findOneByEmail(lowercaseEmail);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.provider !== AuthProvider.LOCAL) {
      throw new UnauthorizedException('User cannot login with this method');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    return this.generateTokens(user);
  }

  async googleLogin(profile: any): Promise<{
    accessToken: string;
    refreshToken: string;
    user: Partial<User>;
  }> {
    const email = profile.email;

    let user = await this.usersService.findOneByEmail(email);
    let isNewUser = false;
    if (!user) {
      isNewUser = true;
      const newUser: CreateUserDto = {
        email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        provider: AuthProvider.GOOGLE,
        dateOfBirth: '',
        location: '',
        address: '',
        role: UserRole.MEMBER,
      };
      user = await this.usersService.create(newUser);
    }
    if (isNewUser) {
      // probably send an email to the new user created because isNewUser is now true globally
      // but for now we will just log the user
      this.logger.log({
        tag: 'NewUser',
        user,
      });
    }
    return this.generateTokens(user);
  }

  private async generateTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
    user: Partial<User>;
  }> {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN'),
    });
    const refreshToken = this.jwtService.sign(
      { sub: payload.sub },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
      },
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    user: Partial<User>;
  }> {
    const payload = this.jwtService.verify(refreshToken, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });

    if (!payload) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }

    try {
      const user = await this.usersService.findOne(payload.sub);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      if (!user.isActive) {
        throw new HttpException(
          'User account is deactivated',
          HttpStatus.FORBIDDEN,
        );
      }
      return this.generateTokens(user);
    } catch (error) {
      // Re-throw HttpExceptions as-is to preserve proper error messages
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   * Get user from access token
   * Used by /auth/me endpoint
   */
  async getUserFromToken(accessToken: string): Promise<Partial<User>> {
    try {
      const payload = this.jwtService.verify(accessToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      if (!payload?.sub) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }

      const user = await this.usersService.findOne(payload.sub);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      if (!user.isActive) {
        throw new HttpException(
          'User account is deactivated',
          HttpStatus.FORBIDDEN,
        );
      }

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
