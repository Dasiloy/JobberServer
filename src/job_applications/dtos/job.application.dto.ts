import { JobApplicationStatus } from '@/jobs/jobs.enum';
import { Expose, Transform } from 'class-transformer';

export class JobApplicationDto {
  @Expose()
  id: string;

  @Expose()
  @Transform((value) => String(value))
  cover_letter: string;

  @Expose()
  status: JobApplicationStatus;
}
