import { RouteMetaKey } from '@/addons/decorators/routes.decorator';
import { RouteMeta } from '@/addons/enums/routes.enum';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '@/users/users.service';
import { ConfigService } from '@nestjs/config';
import { TokenType } from '../auth.enum';
import { UtilsService } from '@/auth/utils.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly utilService: UtilsService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const routeMeta = this.reflector.getAllAndOverride<RouteMeta>(
      RouteMetaKey,
      [context.getHandler(), context.getClass()],
    );

    if (routeMeta === RouteMeta.IS_PUBLIC) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException('Unauthorized');

    let secret: string;
    let token_type: TokenType;
    switch (routeMeta) {
      case RouteMeta.IS_OTP_REQUIRED:
        token_type = TokenType.otp;
        secret = this.configService.get('JWT_OTP_SECRET');
        break;
      case RouteMeta.IS_AUTH_REQUIRED:
        token_type = TokenType.access;
        secret = this.configService.get('JWT_ACCESS_TOKEN_SECRET');
        break;
      case RouteMeta.IS_PROFILE_AUTH_REQUIRED:
        token_type = TokenType.create_profile;
        secret = this.configService.get('JWT_PROFILE_SECRET');
        break;
      case RouteMeta.IS_PASSWORD_AUTH_REQUIRED:
        token_type = TokenType.password;
        secret = this.configService.get('JWT_PASSWORD_SECRET');
        break;
      default:
        break;
    }

    const payload = this.utilService.validateToken({
      token,
      token_type,
      secret,
    });

    if (!payload.id) throw new UnauthorizedException('Unauthorized');
    const user = await this.userService.findById(payload.id);
    if (!user) throw new UnauthorizedException('Unauthorized');
    request.user = user;
    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
