import {
  JobExperience,
  JobLocation,
  JobProfession,
  JobType,
} from '@/jobs/jobs.enum';
import { Entity, Column, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { Education } from '@/educations/education.entity';
import { BaseEntity } from '@/base_entity';
import { JobApplication } from '@/job_applications/job_applications.entity';
import { WorkHistory } from '@/work_histories/work_histories.entity';
import { Portfolio } from '@/portfolios/portfolios.entity';
import { User } from '@/users/users.entity';

@Entity()
export class Profile extends BaseEntity {
  @Column({
    type: 'enum',
    enum: JobProfession,
    nullable: false,
  })
  job_profession: JobProfession;

  @Column({
    type: 'enum',
    enum: JobType,
    array: true,
    default: [],
  })
  job_types: JobType[];

  @Column({
    type: 'enum',
    enum: JobLocation,
    array: true,
    default: [],
  })
  job_locations: JobLocation[];

  @Column({
    type: 'enum',
    enum: JobExperience,
    array: true,
    default: [],
  })
  job_experiences: JobExperience[];

  @Column('text', {
    nullable: true,
  })
  resume_url: string;

  @OneToOne(() => Portfolio, {
    cascade: true,
  })
  @JoinColumn()
  portfolio: Portfolio;

  @OneToOne(() => User, (user) => user.profile)
  user: User;

  @OneToMany(() => Education, (education) => education.profile, {
    cascade: true,
  })
  educations: Education[];

  @OneToMany(() => JobApplication, (application) => application.profile)
  job_applications: JobApplication[];

  @OneToMany(() => WorkHistory, (work_history) => work_history.profile, {
    cascade: true,
  })
  work_history: WorkHistory[];
}
