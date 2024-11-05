import { User } from '@/users/users.entity';
import { TokenType } from './auth.enum';

export interface TokenPayload {
  id: string;
  token_type: TokenType;
  refresh_token?: string;
}

export interface CreateTokenPayload {
  user: User;
  secret: string;
  expiresIn: string;
  token_type: TokenType;
  refresh_token?: string;
}

export interface ValidateTokenPayload {
  token: string;
  secret: string;
  token_type: TokenType;
}
