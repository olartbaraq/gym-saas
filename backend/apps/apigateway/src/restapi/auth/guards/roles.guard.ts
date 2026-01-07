// src/guards/roles.guard.ts (updated with more detailed role checking)
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'apps/auth/src/users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // SuperAdmin has access to everything
    if (user.role === UserRole.SUPERADMIN) {
      return true;
    }

    // Admin has access to everything except SuperAdmin routes
    if (
      (user.role === UserRole.ADMIN ||
        user.role === UserRole.STAFF ||
        user.role === UserRole.TRAINER) &&
      !requiredRoles.includes(UserRole.SUPERADMIN)
    ) {
      return true;
    }

    // Regular user can only access routes that specifically allow USER role
    return requiredRoles.includes(user.role);
  }
}
