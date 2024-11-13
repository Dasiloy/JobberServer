/* eslint-disable @typescript-eslint/no-require-imports */
const crypto = require('crypto');
import { User } from '@/users/users.entity';
import { UsersService } from '@/users/users.service';
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenType } from './auth.enum';
import { RegisterUserDto } from './dtos/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './session.entity';
import { Repository } from 'typeorm';
import { RefreshToken } from './refresh_token.entity';
import { CreateSessionDto } from './dtos/create_seession.dto';
import { RefreshtokenDto } from './dtos/refresh_token.dto';
import { LogoutDto } from './dtos/logout.dto';
import { UtilsService } from '@/auth/utils.service';
import { LoginDto } from './dtos/login.dto';
import { ForgotPasswordDto } from './dtos/forgot_password.dto';
import { ResetPasswordDto } from './dtos/reset_password.dto';
import { ChangePasswordDto } from './dtos/change_password.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuthEvents } from './events';
import { SendEmailOtp, SendSmsOtp } from './events/otp.events';

@Injectable()
export class AuthService {
  constructor(
    private readonly utilsService: UtilsService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly eventemitter: EventEmitter2,
  ) {}

  private createAccessToken(user: User) {
    return this.utilsService.createToken({
      user,
      token_type: TokenType.access,
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION'),
    });
  }

  private createRefreshToken(user: User, token: RefreshToken) {
    return this.utilsService.createToken({
      user,
      refresh_token: token.token_key,
      token_type: TokenType.refresh,
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESHTOKEN_EXPIRATION'),
    });
  }

  private createOtpToken(user: User) {
    return this.utilsService.createToken({
      user,
      token_type: TokenType.otp,
      secret: this.configService.get('JWT_OTP_SECRET'),
      expiresIn: this.configService.get('JWT_OTP_EXPIRATION'),
    });
  }

  private createProfileToken(user: User) {
    return this.utilsService.createToken({
      user,
      token_type: TokenType.create_profile,
      secret: this.configService.get('JWT_PROFILE_SECRET'),
      expiresIn: this.configService.get('JWT_PROFILE_EXPIRATION'),
    });
  }

  private createPasswordToken(user: User) {
    return this.utilsService.createToken({
      user,
      token_type: TokenType.password,
      secret: this.configService.get('JWT_PASSWORD_SECRET'),
      expiresIn: this.configService.get('JWT_PASSWORD_EXPIRATION'),
    });
  }

  private async dumpSessionToken(user: User) {
    const existingSession = await this.sessionRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['refresh_token'],
    });

    if (existingSession) {
      await this.sessionRepository.remove(existingSession);
    }
    const existingToken = await this.refreshTokenRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['session'],
    });

    if (existingToken) {
      await this.refreshTokenRepository.remove(existingToken);
    }
  }

  async createSession({ user, nestSession, request }: CreateSessionDto) {
    await this.dumpSessionToken(user);

    const session = this.sessionRepository.create({
      ip: request.ip,
      user,
      user_agent: request.headers['user-agent'],
    });

    const token = this.refreshTokenRepository.create({
      user,
      session,
      token_key: crypto.randomBytes(20).toString('hex'),
    });
    session.refresh_token = token;
    await this.sessionRepository.save(session);

    nestSession.refreshToken = this.createRefreshToken(user, token);
    return this.createAccessToken(user);
  }

  async refreshToken({ nestSession, request }: RefreshtokenDto) {
    const payload = this.utilsService.validateToken({
      token_type: TokenType.refresh,
      token: nestSession.refreshToken,
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
    });

    const { refresh_token: token_key, id } = payload;
    const user = await this.userService.findById(id);
    if (!user) {
      throw new UnauthorizedException('Invalid  token');
    }

    const refresh_token = await this.refreshTokenRepository.findOne({
      where: {
        token_key,
        user: { id: user.id },
      },
      relations: ['session'],
    });
    if (!refresh_token.session?.valid) {
      throw new UnauthorizedException('Invalid  token');
    }

    const access_token = await this.createSession({
      user,
      request,
      nestSession,
    });

    return {
      message: 'refreshed token successfully',
      access_token,
    };
  }

  async registerUser(data: RegisterUserDto) {
    try {
      const user = this.userService.createUser(data);
      user.email_token = this.utilsService.generateOtpCode();
      user.email_token_expired_at = this.utilsService.createExpiryDate(5);
      await this.userService.saveUser(user);

      const payload: SendEmailOtp = {
        user,
        Subject: 'Email Verification',
        Body: `Your verification code is ${user.email_token}`,
      };
      this.eventemitter.emit(AuthEvents.SEND_EMAIL_OTP, payload);

      return {
        access_token: this.createOtpToken(user),
        message:
          'User registered successfully. Please verify your email address.',
      };
    } catch (error: any) {
      let message = error.message;
      if (error.code === '23505') {
        message = 'Email or phone number  already exists.';
      }
      throw new BadRequestException(message);
    }
  }

  async resendEmailVerificationToken(user: User) {
    if (user.email_verified) {
      throw new BadRequestException('Email is already verified.');
    }

    if (this.userService.checkTokenExpiry(user, 'email')) {
      user.email_token = this.utilsService.generateOtpCode();
      user.email_token_expired_at = this.utilsService.createExpiryDate(5);
      await this.userService.saveUser(user);
    }
    const payload: SendEmailOtp = {
      user,
      Subject: 'Email Verification',
      Body: `Your verification code is ${user.email_token}`,
    };
    this.eventemitter.emit(AuthEvents.SEND_EMAIL_OTP, payload);

    return {
      message: 'Email verification token sent again.',
    };
  }

  async verifyEmailToken(otp: number, user: User) {
    if (user.email_verified) {
      throw new BadRequestException('Email is already verified.');
    }

    if (this.userService.checkTokenExpiry(user, 'email')) {
      throw new BadRequestException('Email verification token expired.');
    }

    if (otp !== user.email_token) {
      throw new BadRequestException('Invalid OTP code.');
    }

    user.email_token = null;
    user.email_token_expired_at = null;
    user.email_verified = true;
    user.email_verified_at = new Date();

    user.phone_number_token = this.utilsService.generateOtpCode();
    user.phone_number_token_expired_at = this.utilsService.createExpiryDate(5);
    await this.userService.saveUser(user);

    const payload: SendSmsOtp = {
      user,
      Subject: 'Phone Verification',
      Message: `Your verification code is ${user.phone_number_token}`,
    };
    this.eventemitter.emit(AuthEvents.SEND_PHONE_OTP, payload);

    return {
      message: 'Email verified successfully.',
    };
  }

  async resendPhoneVerificationToken(user: User) {
    if (user.phone_number_verified) {
      throw new BadRequestException('Phone number is already verified.');
    }

    if (this.userService.checkTokenExpiry(user, 'phone')) {
      user.phone_number_token = this.utilsService.generateOtpCode();
      user.phone_number_token_expired_at =
        this.utilsService.createExpiryDate(5);
      await this.userService.saveUser(user);
    }
    const payload: SendSmsOtp = {
      user,
      Subject: 'Phone Verification',
      Message: `Your verification code is ${user.phone_number_token}`,
    };
    this.eventemitter.emit(AuthEvents.SEND_PHONE_OTP, payload);

    return {
      message: 'Phone verification token sent again.',
    };
  }

  async verifyPhoneToken(otp: number, user: User) {
    if (!user.email_verified) {
      throw new BadRequestException('Email is not verified.');
    }

    if (user.phone_number_verified) {
      throw new BadRequestException('Phone number is already verified.');
    }

    if (this.userService.checkTokenExpiry(user, 'phone')) {
      throw new BadRequestException('Phone number verification token expired.');
    }

    if (otp !== user.phone_number_token) {
      throw new BadRequestException('Invalid OTP code.');
    }

    user.phone_number_token = null;
    user.phone_number_token_expired_at = null;
    user.phone_number_verified = true;
    user.phone_number_verified_at = new Date();
    await this.userService.saveUser(user);

    return {
      access_token: this.createProfileToken(user),
      message: 'Phone number verified successfully.',
    };
  }

  async login(body: LoginDto, { request, nestSession }: RefreshtokenDto) {
    const user = await this.userService.findByEmailOrPhone(body.query, {
      relations: ['followed_companies', 'profile'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isValid = user.comparePassword(body.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (!user.active) {
      throw new UnauthorizedException(
        'Your account has been temporarily disabled.',
      );
    }

    if (user.deleted) {
      throw new UnauthorizedException(
        'Your account has been permanently disabled.',
      );
    }

    if (!user.email_verified) {
      const res = await this.resendEmailVerificationToken(user);
      return {
        ...res,
        data: user,
        access_token: this.createOtpToken(user),
      };
    }

    if (!user.phone_number_verified) {
      const res = await this.resendPhoneVerificationToken(user);
      return {
        ...res,
        data: user,
        access_token: this.createOtpToken(user),
      };
    }

    if (!user.profile) {
      return {
        data: user,
        access_token: this.createProfileToken(user),
        message: 'Profile not found. Please create a profile.',
      };
    }

    const access_token = await this.createSession({
      user,
      request,
      nestSession,
    });
    return {
      access_token,
      data: user,
      message: 'Logged in successfully',
    };
  }

  async forgotPassword(body: ForgotPasswordDto) {
    const user = await this.userService.findByEmailOrPhone(body.query);

    if (user) {
      user.password_reset_token = this.utilsService.generateOtpCode();
      user.password_reset_token_expired_at =
        this.utilsService.createExpiryDate(5);
      await this.userService.saveUser(user);

      const payload: SendEmailOtp | SendSmsOtp = {
        user,
        Subject: 'Password Reset',
        Body: `Your password reset code is ${user.password_reset_token}`,
        Message: `Your password reset code is ${user.password_reset_token}`,
      };
      this.eventemitter.emit(AuthEvents.SEND_EMAIL_OTP, payload);
      this.eventemitter.emit(AuthEvents.SEND_PHONE_OTP, payload);
    }

    return {
      message: 'Otp code sent to email and phone.',
      access_token: user ? this.createOtpToken(user) : '',
    };
  }

  async resendPasswordToken(user: User) {
    if (this.userService.checkTokenExpiry(user, 'password')) {
      user.password_reset_token = this.utilsService.generateOtpCode();
      user.password_reset_token_expired_at =
        this.utilsService.createExpiryDate(5);
      await this.userService.saveUser(user);
    }

    const payload: SendEmailOtp | SendSmsOtp = {
      user,
      Subject: 'Password Reset',
      Body: `Your password reset code is ${user.password_reset_token}`,
      Message: `Your password reset code is ${user.password_reset_token}`,
    };
    this.eventemitter.emit(AuthEvents.SEND_EMAIL_OTP, payload);
    this.eventemitter.emit(AuthEvents.SEND_PHONE_OTP, payload);

    return {
      message: 'Password reset token sent again.',
    };
  }

  async verifyPasswordToken(otp: number, user: User) {
    if (this.userService.checkTokenExpiry(user, 'password')) {
      throw new BadRequestException('Password reset token expired.');
    }

    if (otp !== user.password_reset_token) {
      throw new BadRequestException('Invalid OTP code.');
    }

    user.password_reset_token = null;
    user.password_reset_token_expired_at = null;
    await this.userService.saveUser(user);

    return {
      access_token: this.createPasswordToken(user),
      message: 'Token verified successfully',
    };
  }

  async resetPassword(user: User, data: ResetPasswordDto) {
    const isSameOldPassword = user.comparePassword(data.password);
    if (isSameOldPassword) {
      throw new BadRequestException(
        'Old password cannot be the same as new password.',
      );
    }

    user.password = data.password;
    await this.userService.saveUser(user);

    await this.dumpSessionToken(user);

    return {
      message: 'Password reset successfully.',
    };
  }

  async changePassword(user: User, data: ChangePasswordDto) {
    const isSameOldPassword = user.comparePassword(data.old_password);
    if (!isSameOldPassword) {
      throw new BadRequestException('Incorrect password.');
    }

    user.password = data.new_password;
    await this.userService.saveUser(user);

    return {
      message: 'Password changed successfully.',
    };
  }

  async GetLoggedInUser(user: User) {
    const full_user = await this.userService.findById(user.id, {
      relations: ['followed_companies', 'profile'],
    });
    return {
      message: 'User retrieved successfully',
      data: full_user,
    };
  }
  async logout({ user, nestSession }: LogoutDto) {
    await this.dumpSessionToken(user);

    nestSession.refreshToken = null;

    return {
      message: 'Logged out successfully',
      access_token: 'hrjfkfnfjbfen',
    };
  }
}
