import { User } from '@/users/users.entity';

export class LogoutDto {
  user: User;
  nestSession: any;
}
