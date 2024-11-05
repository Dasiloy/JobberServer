import { Role } from '@/users/users.enum';
import { SetMetadata } from '@nestjs/common';

export const RoleKey = 'Role';
export const SetRoleMeta = (...roles: Role[]) => SetMetadata(RoleKey, roles);
