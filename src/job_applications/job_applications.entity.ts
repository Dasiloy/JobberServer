import { BaseEntity } from '@/base_entity';
import { Job } from '@/jobs/jobs.entity';
import { JobApplicationStatus } from '@/jobs/jobs.enum';
import { Profile } from '@/profiles/profiles.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { JobApplicationTimeline } from './job_applications_timeline.entity';

@Entity()
export class JobApplication extends BaseEntity {
  @Column('enum', {
    enum: JobApplicationStatus,
    default: JobApplicationStatus.APPLIED,
    nullable: false,
  })
  status: JobApplicationStatus;

  @Column('text', {
    nullable: true,
  })
  cover_letter: string;

  @ManyToOne(() => Profile, (profile) => profile.job_applications)
  profile: Profile;

  @ManyToOne(() => Job, (job) => job.applications)
  job: Job;

  @OneToMany(
    () => JobApplicationTimeline,
    (timeline) => timeline.job_application,
    { cascade: true },
  )
  timeline: JobApplicationTimeline[];
}
