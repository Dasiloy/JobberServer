import { IsPasswordDifferent } from '@/addons/validators/password.validator';
import { IsNotEmpty, IsString, Validate } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  old_password: string;

  @IsNotEmpty()
  @IsString()
  @Validate(IsPasswordDifferent)
  new_password: string;
}
