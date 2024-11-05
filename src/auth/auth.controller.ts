import { SetRouteMeta } from '@/addons/decorators/routes.decorator';
import { RouteMeta } from '@/addons/enums/routes.enum';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Session,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dtos/register.dto';
import { VerifyCodeDto } from './dtos/verify_code.dto';
import { CurrentUser } from '@/addons/decorators/current_user.decorator';
import { User } from '@/users/users.entity';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SetRouteMeta(RouteMeta.IS_PUBLIC)
  @HttpCode(201)
  @Post('/register')
  register(@Body() body: RegisterUserDto) {
    return this.authService.registerUser(body);
  }

  @SetRouteMeta(RouteMeta.IS_OTP_REQUIRED)
  @HttpCode(200)
  @Post('/resend-email-verification-token')
  resendEmailVerificationToken(@CurrentUser() user: User) {
    return this.authService.resendEmailVerificationToken(user);
  }

  @SetRouteMeta(RouteMeta.IS_OTP_REQUIRED)
  @HttpCode(200)
  @Post('/verify-email')
  verifyEmail(@Body() body: VerifyCodeDto, @CurrentUser() user: User) {
    return this.authService.verifyEmailToken(Number(body.token), user);
  }

  @SetRouteMeta(RouteMeta.IS_OTP_REQUIRED)
  @HttpCode(200)
  @Post('/resend-phone-verification-token')
  resendPhoneVerificationToken(@CurrentUser() user: User) {
    return this.authService.resendPhoneVerificationToken(user);
  }

  @SetRouteMeta(RouteMeta.IS_OTP_REQUIRED)
  @Post('/verify-phone-number')
  verifyPhoneNumber(@Body() body: VerifyCodeDto, @CurrentUser() user: User) {
    return this.authService.verifyPhoneToken(Number(body.token), user);
  }

  @SetRouteMeta(RouteMeta.IS_PUBLIC)
  @HttpCode(200)
  @Post('/login')
  login() {}

  @SetRouteMeta(RouteMeta.IS_PUBLIC)
  @HttpCode(200)
  @Post('/forgot-password')
  forgotPassword() {}

  @SetRouteMeta(RouteMeta.IS_OTP_REQUIRED)
  @HttpCode(200)
  @Post('/verify-reset-token')
  verifyResetToken() {}

  @SetRouteMeta(RouteMeta.IS_OTP_REQUIRED)
  @HttpCode(200)
  @Post('/reset-password')
  resetPassword() {}

  @SetRouteMeta(RouteMeta.IS_PUBLIC)
  @HttpCode(200)
  @Post('/refresh-token')
  refreshToken(@Session() session: any, @Req() request: Request) {
    return this.authService.refreshToken({ nestSession: session, request });
  }

  @SetRouteMeta(RouteMeta.IS_AUTH_REQUIRED)
  @HttpCode(200)
  @Post('/logout')
  logoutUser(@CurrentUser() user: User, @Session() session: any) {
    return this.authService.logout({ user, nestSession: session });
  }

  @SetRouteMeta(RouteMeta.IS_AUTH_REQUIRED)
  @HttpCode(200)
  @Get('/me')
  getLoggedInUser(@CurrentUser() user: User) {
    return {
      message: 'User retrieved successfully',
      data: user,
    };
  }
}
