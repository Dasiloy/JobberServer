import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import {
  JobExperience,
  JobLocation,
  JobPayFrequency,
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
    default: JobStatus.OPEN,
  })
  status: JobStatus;

  @Column('int', {
    nullable: false,
  })
  pay: number;

  @Column('enum', {
    enum: JobPayFrequency,
    nullable: false,
  })
  pay_frequency: JobPayFrequency;

  @Column('text', {
    nullable: true,
  })
  about: string;

  @Column('text', {
    nullable: true,
  })
  description: string;

  @Column('text', {
    nullable: true,
  })
  requirements: string;

  @Column({
    type: 'enum',
    enum: JobType,
    array: true,
  })
  types: JobType[];

  @Column({
    type: 'enum',
    array: true,
    enum: JobLocation,
  })
  locations: JobLocation[];

  @Column({
    type: 'enum',
    enum: JobExperience,
    array: true,
  })
  experiences: JobExperience[];

  @ManyToOne(() => Company, (company) => company.jobs, {
    eager: true,
  })
  company: Company;

  @OneToMany(() => JobApplication, (job_application) => job_application.job, {
    cascade: true,
  })
  applications: JobApplication[];
}
