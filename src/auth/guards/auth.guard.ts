import { RouteMetaKey } from '@/addons/decorators/routes.decorator';
import { RouteMeta } from '@/addons/enums/routes.enum';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';
import { UsersService } from '@/users/users.service';
import { ConfigService } from '@nestjs/config';
import { TokenType } from '../auth.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
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
    switch (routeMeta) {
      case RouteMeta.IS_OTP_REQUIRED:
        const payloadOtp = this.authService.validateToken({
          token,
          token_type: TokenType.otp,
          secret: this.configService.get('JWT_OTP_SECRET'),
        });
        if (!payloadOtp.id) throw new UnauthorizedException('Unauthorized');
        const otpUser = await this.userService.findById(payloadOtp.id);
        if (!otpUser) throw new UnauthorizedException('Unauthorized');
        request.user = otpUser;
        return true;
      case RouteMeta.IS_AUTH_REQUIRED:
        const payloadAuth = this.authService.validateToken({
          token,
          token_type: TokenType.access,
          secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        });
        if (!payloadAuth.id) throw new UnauthorizedException('Unauthorized');
        const authUser = this.userService.findById(payloadAuth.id);
        if (!authUser) throw new UnauthorizedException('Unauthorized');
        request.user = authUser;
        return true;
      case RouteMeta.IS_PROFILE_AUTH_REQUIRED:
        const payloadProfileAuth = this.authService.validateToken({
          token,
          token_type: TokenType.create_profile,
          secret: this.configService.get('JWT_PROFILE_SECRET'),
        });

        if (!payloadProfileAuth.id)
          throw new UnauthorizedException('Unauthorized');
        const profileAuthUser = this.userService.findById(
          payloadProfileAuth.id,
        );
        if (!profileAuthUser) throw new UnauthorizedException('Unauthorized');
        request.user = profileAuthUser;
        return true;
      default:
        throw new UnauthorizedException('Unauthorized');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
