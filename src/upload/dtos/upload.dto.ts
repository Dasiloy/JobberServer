import { User } from '@/users/users.entity';

export interface UploadDto {
  user: User;
  file: Express.Multer.File;
  folder: 'resumes' | 'portfolios' | 'general';
}

export interface UploadAvatarDto {
  user: User;
  file: Express.Multer.File;
}
