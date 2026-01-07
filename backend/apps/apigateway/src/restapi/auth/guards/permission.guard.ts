import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { ROLE_PERMISSIONS } from 'apps/apigateway/src/constants/role.permission';
import { RolePermission } from '../decorators/role.types';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get(
      PERMISSIONS_KEY,
      context.getHandler(),
    );

    if (!requiredPermissions) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const userPermissions = ROLE_PERMISSIONS.get(user.role) || [];

    return this.matchPermissions(userPermissions, requiredPermissions);
  }

  private matchPermissions(
    userPermissions: RolePermission[],
    required: { resource: string; action: string },
  ): boolean {
    return userPermissions.some(
      (permission) =>
        permission.resource === required.resource &&
        permission.actions.includes(required.action),
    );
  }
}
