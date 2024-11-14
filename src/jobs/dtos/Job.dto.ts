import { JobStatus } from 'aws-sdk/clients/batch';
import { Expose, Transform } from 'class-transformer';
import { JobExperience, JobLocation, JobPayFrequency } from '../jobs.enum';
import { JobType } from 'aws-sdk/clients/importexport';
import { Company } from '@/companies/companies.entity';
import { Job } from '../jobs.entity';
import { pick } from 'lodash';

export class JobDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  status: JobStatus;

  @Expose()
  pay: number;

  @Expose()
  pay_frequency: JobPayFrequency;

  //   @Column('text')
  //   about: string;

  //   @Column('text')
  //   description: string;

  //   @Column('text')
  //   requirements: string;

  @Expose()
  types: JobType[];

  @Expose()
  locations: JobLocation[];

  @Expose()
  experiences: JobExperience[];

  @Expose()
  @Transform(({ obj }: { obj: Job }) => {
    return pick(obj.company, ['id', 'name', 'logo', 'address']);
  })
  company: Company;
}
