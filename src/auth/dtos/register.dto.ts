import { IsValidPhoneNumberConstraint } from '@/addons/validators/phone_number.validator';
import {
  IsEmail,
  IsNumberString,
  IsString,
  Length,
  Matches,
  MinLength,
  Validate,
} from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @MinLength(2)
  first_name: string;

  @IsString()
  @MinLength(2)
  last_name: string;

  @IsEmail()
  email: string;

  @IsNumberString()
  @Length(1, 4)
  country_code: string;

  @IsNumberString()
  @Length(6, 15)
  @Validate(IsValidPhoneNumberConstraint)
  phone_number: string;

  @IsString()
  @Length(8, 50)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long, include uppercase, lowercase letters, a number, and a special character',
    },
  )
  password: string;
}
