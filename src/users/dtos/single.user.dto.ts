import { Expose, Transform } from 'class-transformer';
import { UserDto } from './user.dto';
import {
  JobExperience,
  JobLocation,
  JobProfession,
  JobType,
} from '@/jobs/jobs.enum';

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
}
