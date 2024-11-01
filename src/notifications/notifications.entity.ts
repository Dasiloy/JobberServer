import { BaseEntity } from '@/base_entity';
import { Company } from '@/companies/companies.entity';
import { JobApplication } from '@/job_applications/job_applications.entity';
import { User } from '@/users/users.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity()
export class Notification extends BaseEntity {
  @Column({
    type: 'enum',
    enum: [
      'APPLICATION_UPDATE',
      'JOB_POSTING',
      'INTERVIEW_SCHEDULE',
      'PERSONAL',
    ],
  })
  type:
    | 'APPLICATION_UPDATE'
    | 'JOB_POSTING'
    | 'INTERVIEW_SCHEDULE'
    | 'PERSONAL';

  @Column({ type: 'text' })
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  user: User;

  @ManyToOne(() => JobApplication, { nullable: true, onDelete: 'SET NULL' })
  jobApplication?: JobApplication;

  @ManyToOne(() => Company, { nullable: true, onDelete: 'SET NULL' })
  company?: Company;

  @Column({ type: 'jsonb', nullable: true })
  payload?: Record<string, any>;

  @Column({ type: 'timestamp', nullable: true })
  readAt?: Date;
}
