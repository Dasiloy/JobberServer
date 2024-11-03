import {
  JobExperience,
  JobLocation,
  JobProfession,
  JobType,
} from '@/jobs/jobs.enum';
import { User } from '@/users/users.entity';
// import { Portfolio } from '@/portfolios/portfolios.entity';
import { Entity, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Education } from '@/educations/education.entity';
import { BaseEntity } from '@/base_entity';
import { JobApplication } from '@/job_applications/job_applications.entity';
import { WorkHistory } from '@/work_histories/work_histories.entity';

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
  })
  job_type: JobType[];

  @Column({
    type: 'enum',
    enum: JobLocation,
    array: true,
  })
  job_location: JobLocation[];

  @Column({
    type: 'enum',
    enum: JobExperience,
    array: true,
  })
  job_experiences: JobExperience[];

  @Column({
    nullable: true,
  })
  resume_url: string;

  @OneToOne(() => User, (user) => user.profile)
  user: User;

  // @OneToOne(() => Portfolio, {
  //   cascade: true,
  // })
  // @JoinColumn()
  // portfolio: Portfolio;

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
