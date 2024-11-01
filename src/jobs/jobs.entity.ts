import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import {
  JobExperience,
  JobLocation,
  JobPayFrequency,
  JobProfession,
  JobStatus,
  JobType,
} from './jobs.enum';
import { Company } from '@/companies/companies.entity';
import { BaseEntity } from '@/base_entity';
import { JobApplication } from '@/job_applications/job_applications.entity';

@Entity()
export class Job extends BaseEntity {
  @Column('varchar', {
    length: 255,
    nullable: false,
  })
  title: string;

  @Column('enum', {
    enum: JobStatus,
    nullable: false,
  })
  status: JobStatus;

  @Column('int', {
    nullable: false,
  })
  pay: number;

  @Column('enum', {
    enum: JobExperience,
    nullable: false,
    array: true,
  })
  pay_frequency: JobPayFrequency;

  @Column('text')
  about: string;

  @Column('text')
  description: string;

  @Column('text')
  requirements: string;

  @Column({
    type: 'enum',
    enum: JobProfession,
    nullable: false,
  })
  profession: JobProfession;

  @Column({
    type: 'enum',
    enum: JobType,
    array: true,
  })
  type: JobType;

  @Column({
    type: 'enum',
    enum: JobLocation,
  })
  location: JobLocation;

  @Column({
    type: 'enum',
    enum: JobExperience,
    array: true,
  })
  experiences: JobExperience;

  @ManyToOne(() => Company, (company) => company.jobs, { eager: true })
  company: Company;

  @OneToMany(() => JobApplication, (job_application) => job_application.job)
  applications: JobApplication[];
}
