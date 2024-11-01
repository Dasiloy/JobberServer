import { BaseEntity } from '@/base_entity';
import {
  JobApplicationTimelineStage,
  JobApplicationTimelineStatus,
} from '@/jobs/jobs.enum';
import { Column, Entity, ManyToOne } from 'typeorm';
import { JobApplication } from './job_applications.entity';

@Entity()
export class JobApplicationTimeline extends BaseEntity {
  @Column('enum', {
    enum: JobApplicationTimelineStage,
    default: JobApplicationTimelineStage.APPLIED,
    nullable: false,
  })
  stage: JobApplicationTimelineStage;

  @Column('enum', {
    enum: JobApplicationTimelineStatus,
    default: JobApplicationTimelineStatus.PENDING,
    nullable: false,
  })
  status: JobApplicationTimelineStatus;

  @Column('text', { nullable: true })
  notes: string;

  @ManyToOne(() => JobApplication, (application) => application.timeline)
  job_application: JobApplication;
}
