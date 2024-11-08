import { Expose, Transform } from 'class-transformer';
import { Role } from '@/users/users.enum';
import {
  JobExperience,
  JobLocation,
  JobProfession,
  JobType,
} from '@/jobs/jobs.enum';
import { Company } from '@/companies/companies.entity';

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

export class SingleUserDto extends UserDto {
  @Expose()
  @Transform(({ obj }) => obj.profile?.id || null)
  profile_id: string;

  @Expose()
  @Transform(({ obj }) => obj.profile?.job_types || [])
  job_types: JobType[];

  @Expose()
  @Transform(({ obj }) => obj.profile?.job_profession || null)
  job_profession: JobProfession;

  @Expose()
  @Transform(({ obj }) => obj.profile?.resume_url || null)
  resume_url: string;

  @Expose()
  @Transform(({ obj }) => obj.profile?.job_locations || [])
  job_locations: JobLocation[];

  @Expose()
  @Transform(({ obj }) => obj.profile?.job_experiences || [])
  job_experiences: JobExperience[];

  @Expose()
  @Transform(({ obj }) => obj.followed_companies?.length || 0)
  companies_followed_count: number;

  @Expose()
  @Transform(
    ({ obj }) =>
      obj.followed_companies?.map((c: Company) => ({
        id: c.id,
        name: c.name,
        logo: c.logo,
      })) || [],
  )
  companies_followed: Company[];
}
