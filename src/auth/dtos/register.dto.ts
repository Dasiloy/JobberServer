import { IsValidPhoneNumberConstraint } from '@/addons/validators/phone_number.validator';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    type: String,
    required: true,
    example: 'John',
  })
  @IsString()
  @MinLength(2)
  first_name: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Doe',
  })
  @IsString()
  @MinLength(2)
  last_name: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'johndoe@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '234',
  })
  @IsNumberString()
  @Length(1, 4)
  country_code: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '9039714793',
  })
  @IsNumberString()
  @Length(6, 15)
  @Validate(IsValidPhoneNumberConstraint)
  phone_number: string;

  @ApiProperty({
    type: String,
    required: true,
    example: '$3647848394878Yto',
  })
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
