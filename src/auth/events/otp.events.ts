import { User } from '@/users/users.entity';

export interface SendEmailOtp {
  user: User;
  Subject: string;
  Body: string;
}

export interface SendSmsOtp {
  user: User;
  Message: string;
  Subject: string;
}
