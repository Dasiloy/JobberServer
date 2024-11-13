import { User } from '@/users/users.entity';
import { Request } from 'express';

export class CreateSessionDto {
  user: User;
  request: Request;
  nestSession: any;
}
