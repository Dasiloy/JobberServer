import { RoleKey } from '@/addons/decorators/roles.decorator';
import { User } from '@/users/users.entity';
import { Role } from '@/users/users.enum';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<Role[]>(RoleKey, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) {
      return true; // If no roles are specified, allow access
    }

    const req = context.switchToHttp().getRequest();
    const user: User = req.user;
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    const hasRole = roles.some((role) => user.role === role);
    if (!hasRole) {
      throw new UnauthorizedException('Unauthorized');
    }

    return true;
  }
}
