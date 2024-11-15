import {
  JobApplicationTimelineStage,
  JobApplicationTimelineStatus,
} from '@/jobs/jobs.enum';
import { Expose } from 'class-transformer';

export class JobApplicationTimeLineDto {
  @Expose()
  id: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Expose()
  stage: JobApplicationTimelineStage;

  @Expose()
  status: JobApplicationTimelineStatus;

  @Expose()
  notes: string;
}
