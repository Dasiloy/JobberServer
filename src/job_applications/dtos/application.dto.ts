import { Expose, Type } from 'class-transformer';
import { JobApplicationDto } from './job.application.dto';
import { JobDto } from '@/jobs/dtos/Job.dto';
import { Job } from '@/jobs/jobs.entity';

export class ApplicationDto extends JobApplicationDto {
  @Expose()
  @Type(() => JobDto)
  job: Job;
}
