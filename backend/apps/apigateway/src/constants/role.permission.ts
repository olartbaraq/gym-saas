import { RolePermission } from '../restapi/auth/decorators/role.types';
import { UserRole } from 'apps/auth/src/users/entities/user.entity';

export const ROLE_PERMISSIONS = new Map<UserRole, RolePermission[]>([
  [
    UserRole.OWNER,
    [
      {
        resource: 'gyms',
        actions: ['create', 'read', 'update', 'delete'],
      },
    ],
  ],
  [
    UserRole.SUPERADMIN,
    [
      {
        resource: 'users',
        actions: [
          'create',
          'read',
          'update',
          'delete',
          'activate',
          'deactivate',
        ],
      },
      {
        resource: 'gyms',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        resource: 'roles',
        actions: ['create', 'read', 'update', 'delete'],
      },
    ],
  ],
  [
    UserRole.ADMIN,
    [
      {
        resource: 'users',
        actions: [
          'create',
          'read',
          'update',
          'delete',
          'activate',
          'deactivate',
        ],
      },
      {
        resource: 'roles',
        actions: ['read'],
      },
    ],
  ],
  [
    UserRole.STAFF,
    [
      {
        resource: 'users',
        actions: ['create', 'read', 'update', 'activate', 'deactivate'],
      },
      {
        resource: 'roles',
        actions: ['read'],
      },
    ],
  ],
  [
    UserRole.TRAINER,
    [
      {
        resource: 'users',
        actions: ['read'],
      },
      {
        resource: 'roles',
        actions: ['read'],
      },
    ],
  ],
  [
    UserRole.MEMBER,
    [
      {
        resource: 'users',
        actions: ['read-self', 'update-self'],
      },
    ],
  ],
]);
