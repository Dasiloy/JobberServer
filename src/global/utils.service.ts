import { TokenType } from '@/auth/auth.enum';
import {
  CreateTokenPayload,
  TokenPayload,
  ValidateTokenPayload,
} from '@/auth/auth.interface';
import { User } from '@/users/users.entity';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UtilsService {
  constructor(private readonly jwtService: JwtService) {}

  public createExpiryDate(minutes: number) {
    const date = new Date();
    date.setMinutes(date.getMinutes() + minutes);
    return date;
  }

  public generateOtpCode() {
    return Math.floor(100000 + Math.random() * 900000);
  }

  public createPayload(
    user: User,
    token_type: TokenType,
    refresh_token = '',
  ): TokenPayload {
    const payload: TokenPayload = { id: user.id, token_type };
    if (refresh_token) {
      payload.refresh_token = refresh_token;
    }
    return payload;
  }

  public createToken({
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
}
