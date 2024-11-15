import { Expose, Transform } from 'class-transformer';
import { Role } from '@/users/users.enum';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  first_name: string;

  @Expose()
  last_name: string;

  @Expose()
  @Transform(({ obj }) => `${obj.first_name} ${obj.last_name}`)
  full_name: string;

  @Expose()
  email: string;

  @Expose()
  email_verified: boolean;

  @Expose()
  country_code: string;

  @Expose()
  phone_number: string;

  @Expose()
  @Transform(({ obj }) => `+${obj.country_code}${obj.phone_number}`)
  full_phone_number: string;

  @Expose()
  phone_number_verified: boolean;

  @Expose()
  active: boolean;

  @Expose()
  deleted: boolean;

  @Expose()
  profile_pic: string;

  @Expose()
  role: Role;
}
