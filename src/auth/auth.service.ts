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
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TokenType } from './auth.enum';
import {
  CreateTokenPayload,
  TokenPayload,
  ValidateTokenPayload,
} from './auth.interface';
import { RegisterUserDto } from './dtos/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './session.entity';
import { Repository } from 'typeorm';
import { RefreshToken } from './refresh_token.entity';
import { CreateSessionDto } from './dtos/create_seession.dto';
import { RefreshtokenDto } from './dtos/refresh_token.dto';
import { LogoutDto } from './dtos/logout.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  private createExpiryDate(minutes: number) {
    const date = new Date();
    date.setMinutes(date.getMinutes() + minutes);
    return date;
  }

  private generateOtpCode() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  private createPayload(
    { id }: User,
    token_type: TokenType,
    refresh_token = '',
  ): TokenPayload {
    const payload: TokenPayload = { id, token_type };
    if (refresh_token) {
      payload.refresh_token = refresh_token;
    }
    return payload;
  }

  private createToken({
    user,
    token_type,
    secret,
    expiresIn,
    refresh_token,
  }: CreateTokenPayload) {
    return this.jwtService.sign(
      this.createPayload(user, token_type, refresh_token),
      {
        secret,
        expiresIn,
      },
    );
  }

  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private verifyPassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }

  public validateToken({ token, secret, token_type }: ValidateTokenPayload) {
    try {
      const decode: TokenPayload = this.jwtService.verify(token, {
        secret,
      });
      if (decode.token_type !== token_type) {
        throw new UnauthorizedException();
      }
      return decode;
    } catch (error: any) {
      throw new UnauthorizedException('token expired');
    }
  }

  async createSession({ user, nestSession, request }: CreateSessionDto) {
    // 1 check if user already has a session
    const existingSession = await this.sessionRepository.findOne({
      where: { user: { id: user.id } },
    });
    if (existingSession) {
      await this.sessionRepository.remove(existingSession);
    }

    const existingToken = await this.refreshTokenRepository.findOne({
      where: { user: { id: user.id } },
    });
    if (existingToken) {
      await this.refreshTokenRepository.remove(existingToken);
    }

    // 2 session
    const session = this.sessionRepository.create({
      ip: request.ip,
      user,
      user_agent: request.headers['user-agent'],
    });

    // 3 create refresh token
    const token = this.refreshTokenRepository.create({
      user,
      session,
      token_key: crypto.randomBytes(20).toString('hex'),
    });
    session.refresh_token = token;
    await this.sessionRepository.save(session);

    const access_token = this.createToken({
      user,
      token_type: TokenType.access,
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION'),
    });

    const refresh_token = this.createToken({
      user,
      refresh_token: token.token_key,
      token_type: TokenType.refresh,
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESHTOKEN_EXPIRATION'),
    });

    nestSession.refreshToken = refresh_token;
    return access_token;
  }

  async refreshToken({ nestSession, request }: RefreshtokenDto) {
    // 1. decode refresh token
    const payload = this.validateToken({
      token_type: TokenType.refresh,
      token: nestSession.refreshToken,
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
    });
    //2 we will extract refresh_token and id of user from decoded token
    const { refresh_token: token_key, id } = payload;
    //3 we will fetch the user from database using id
    const user = await this.userService.findByIdWithoutRelations(id);
    if (!user) {
      throw new UnauthorizedException('Invalid  token');
    }
    // 4 we will get the session and refresh_token using the token_key and user
    const refresh_token = await this.refreshTokenRepository.findOne({
      where: {
        token_key,
        user: { id: user.id },
      },
      relations: ['session'],
    });

    // 5 check if session is valid
    if (!refresh_token.session?.valid) {
      throw new UnauthorizedException('Invalid  token');
    }
    const access_token = await this.createSession({
      user,
      nestSession,
      request,
    });

    return {
      message: 'refreshed token successfully',
      access_token,
    };
  }

  async logout({ user, nestSession }: LogoutDto) {
    // 1 check if user already has a session
    const existingSession = await this.sessionRepository.findOne({
      where: { user: { id: user.id } },
    });
    if (existingSession) {
      await this.sessionRepository.remove(existingSession);
    }

    // 2 check if user already has a refresh token
    const existingToken = await this.refreshTokenRepository.findOne({
      where: { user: { id: user.id } },
    });
    if (existingToken) {
      await this.refreshTokenRepository.remove(existingToken);
    }

    // clear cookie
    nestSession.refreshToken = null;

    return {
      message: 'Logged out successfully',
      access_token: 'hrjfkfnfjbfen',
    };
  }

  async registerUser(data: RegisterUserDto) {
    // 1. Check if user already exists
    const existingUser = await this.userService.findByMail(data.email);
    if (existingUser) {
      throw new BadRequestException(
        'User already exists with this email address. Please use a different email address.',
      );
    }

    // 2. hash user password
    data.password = await this.hashPassword(data.password);

    // 3. Create new user
    const user = await this.userService.createUser(data);

    // 4. lets generate otp code and save against the user
    const otpCode = this.generateOtpCode();
    user.email_token = otpCode;
    user.email_token_expired_at = this.createExpiryDate(5);

    // 5. Create email verification token
    const access_token = this.createToken({
      user,
      token_type: TokenType.otp,
      secret: this.configService.get('JWT_OTP_SECRET'),
      expiresIn: this.configService.get('JWT_OTP_EXPIRATION'),
    });

    //! 6. use event to send email verification token to user

    // 7. save the user
    await this.userService.saveUser(user);

    return {
      //! we will remove the token field later
      token: user.email_token,
      access_token,
      message:
        'User registered successfully. Please verify your email address.',
    };
  }

  async resendEmailVerificationToken(user: User) {
    // 1.  check if the user is already verified
    if (user.email_verified) {
      throw new BadRequestException('Email is already verified.');
    }

    // 2. check if the otp code has expired
    let otpCode = user.email_token;
    if (user.email_token_expired_at?.getTime() < Date.now()) {
      // 3 . generate otp code and save against the user
      otpCode = this.generateOtpCode();
      user.email_token = otpCode;
      user.email_token_expired_at = this.createExpiryDate(5);
      //! 4. use event to send email verification token to user

      // 5. save the user
      await this.userService.saveUser(user);
    }

    return {
      //! we will remove the token field later
      token: user.email_token,
      message: 'Email verification token sent again.',
    };
  }

  async verifyEmailToken(otp: number, user: User) {
    if (user.email_verified) {
      throw new BadRequestException('Email is already verified.');
    }
    // 1. Check if token is expired
    if (user.email_token_expired_at?.getTime() < Date.now()) {
      throw new BadRequestException('Email verification token expired.');
    }

    // 2. Check if otp code matches
    if (otp !== user.email_token) {
      throw new BadRequestException('Invalid OTP code.');
    }

    // 3. Mark user as verified
    user.email_token = null;
    user.email_token_expired_at = null;
    user.email_verified = true;
    user.email_verified_at = new Date();

    // 4. generate otp code
    const otpCode = this.generateOtpCode();
    user.phone_number_token = otpCode;
    user.phone_number_token_expired_at = this.createExpiryDate(5);

    // 6. use event to send otp code to user

    // 7. save the user
    await this.userService.saveUser(user);

    return {
      //! we will remove the token field later
      token: user.phone_number_token,
      message: 'Email verified successfully.',
    };
  }

  async resendPhoneVerificationToken(user: User) {
    //1. check if user email is verified
    if (!user.email_verified) {
      throw new BadRequestException('Email is not verified.');
    }
    // 2.  check if the user is already verified
    if (user.phone_number_verified) {
      throw new BadRequestException('Phone number is already verified.');
    }

    // 3. check if the otp code has expired
    let otpCode = user.phone_number_token;
    if (user.phone_number_token_expired_at?.getTime() < Date.now()) {
      // 4 . generate otp code and save against the user
      otpCode = this.generateOtpCode();
      user.phone_number_token = otpCode;
      user.phone_number_token_expired_at = this.createExpiryDate(5);
      //! 4. use event to send phone verification token to user

      // 5. save the user
      await this.userService.saveUser(user);
    }

    return {
      //! we will remove the token field later
      token: user.phone_number_token,
      message: 'Phone verification token sent again.',
    };
  }

  async verifyPhoneToken(otp: number, user: User) {
    // 1 check if user email is verified
    if (!user.email_verified) {
      throw new BadRequestException('Email is not verified.');
    }

    // 1. Check if the user is already verified
    if (user.phone_number_verified) {
      throw new BadRequestException('Phone number is already verified.');
    }
    // 2. Check if token is expired
    if (user.phone_number_token_expired_at?.getTime() < Date.now()) {
      throw new BadRequestException('Phone number verification token expired.');
    }

    // 3. Check if otp code matches
    if (otp !== user.phone_number_token) {
      throw new BadRequestException('Invalid OTP code.');
    }

    // 4. Mark user phone number as verified
    user.phone_number_token = null;
    user.phone_number_token_expired_at = null;
    user.phone_number_verified = true;
    user.phone_number_verified_at = new Date();

    // 5. create access token
    const access_token = this.createToken({
      user,
      token_type: TokenType.create_profile,
      secret: this.configService.get('JWT_PROFILE_SECRET'),
      expiresIn: this.configService.get('JWT_PROFILE_EXPIRATION'),
    });

    // 6. save the user
    await this.userService.saveUser(user);

    return {
      access_token,
      message: 'Successfully registered',
    };
  }
}
