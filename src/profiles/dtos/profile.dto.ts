import {
  JobExperience,
  JobLocation,
  JobProfession,
  JobType,
} from '@/jobs/jobs.enum';
import { Expose } from 'class-transformer';

export class ProfileDto {
  @Expose()
  id: string;

  @Expose()
  job_profession: JobProfession;

  @Expose()
  job_types: JobType[];

  @Expose()
  job_locations: JobLocation[];

  @Expose()
  job_experiences: JobExperience[];

  @Expose()
  resume_url: string;
}
