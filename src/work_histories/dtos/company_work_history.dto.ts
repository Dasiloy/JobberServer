import { Expose } from 'class-transformer';
import { JobLocation, JobType } from '@/jobs/jobs.enum';

export class CompanyWorkHistoryDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  job_type: JobType;

  @Expose()
  job_location: JobLocation;

  @Expose()
  start_date: Date;

  @Expose()
  end_date: Date;
}
