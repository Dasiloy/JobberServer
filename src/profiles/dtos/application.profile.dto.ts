import { Expose, Transform } from 'class-transformer';
import { ProfileDto } from './profile.dto';
import { Role } from '@/users/users.enum';

export class ApplicationProfileDto extends ProfileDto {
  @Expose()
  @Transform(({ obj }) => obj.user?.id || null)
  user_id: string;

  @Expose()
  @Transform(({ obj }) => obj.user?.first_name || null)
  first_name: string;

  @Expose()
  @Transform(({ obj }) => obj.user?.last_name || null)
  last_name: string;

  @Expose()
  @Transform(
    ({ obj }) => `${obj.user?.first_name || ''} ${obj.user?.last_name || ''}`,
  )
  full_name: string;

  @Expose()
  @Transform(({ obj }) => obj.user?.email || null)
  email: string;

  @Expose()
  @Transform(({ obj }) => obj.user?.country_code || null)
  country_code: string;

  @Expose()
  @Transform(({ obj }) => obj.user?.phone_number || null)
  phone_number: string;

  @Expose()
  @Transform(
    ({ obj }) =>
      `+${obj.user?.country_code || ''}${obj.user?.phone_number || ''}`,
  )
  full_phone_number: string;

  @Expose()
  @Transform(({ obj }) => obj.user?.profile_pic || false)
  profile_pic: string;

  @Expose()
  @Transform(({ obj }) => obj.user?.role || null)
  role: Role;
}
