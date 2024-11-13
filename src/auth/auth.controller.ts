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
import { LoginDto } from './dtos/login.dto';
import { ForgotPasswordDto } from './dtos/forgot_password.dto';
import { ResetPasswordDto } from './dtos/reset_password.dto';
import { ChangePasswordDto } from './dtos/change_password.dto';
import { Serialize } from '@/addons/decorators/serialize.decorator';
import { SingleUserDto } from '@/users/dtos/user.dto';

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
  @Serialize(SingleUserDto)
  @HttpCode(200)
  @Post('/login')
  login(
    @Body() body: LoginDto,
    @Session() session: any,
    @Req() request: Request,
  ) {
    return this.authService.login(body, {
      nestSession: session,
      request,
    });
  }

  @SetRouteMeta(RouteMeta.IS_PUBLIC)
  @HttpCode(200)
  @Post('/forgot-password')
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body);
  }

  @SetRouteMeta(RouteMeta.IS_OTP_REQUIRED)
  @HttpCode(200)
  @Post('/resend-password-token')
  resendPasswordVerificationToken(@CurrentUser() user: User) {
    return this.authService.resendPasswordToken(user);
  }

  @SetRouteMeta(RouteMeta.IS_OTP_REQUIRED)
  @HttpCode(200)
  @Post('/verify-reset-token')
  verifyResetToken(@Body() body: VerifyCodeDto, @CurrentUser() user: User) {
    return this.authService.verifyPasswordToken(Number(body.token), user);
  }

  @SetRouteMeta(RouteMeta.IS_PASSWORD_AUTH_REQUIRED)
  @HttpCode(200)
  @Post('/reset-password')
  resetPassword(@CurrentUser() user: User, @Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(user, body);
  }

  @SetRouteMeta(RouteMeta.IS_AUTH_REQUIRED)
  @HttpCode(200)
  @Post('/change-password')
  changePassword(@CurrentUser() user: User, @Body() body: ChangePasswordDto) {
    return this.authService.changePassword(user, body);
  }

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
  @Serialize(SingleUserDto)
  @HttpCode(200)
  @Get('/me')
  getLoggedInUser(@CurrentUser() user: User) {
    return this.authService.GetLoggedInUser(user);
  }
}
