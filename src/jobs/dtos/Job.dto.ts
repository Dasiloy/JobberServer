import { JobStatus } from 'aws-sdk/clients/batch';
import { Expose, Type } from 'class-transformer';
import { JobType } from 'aws-sdk/clients/importexport';
import { Company } from '@/companies/companies.entity';
import { JobCompanyDto } from '@/companies/dtos/job.company.dto';
import { JobExperience, JobLocation, JobPayFrequency } from '../jobs.enum';

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

  @Expose()
  types: JobType[];

  @Expose()
  locations: JobLocation[];

  @Expose()
  experiences: JobExperience[];

  @Expose()
  @Type(() => JobCompanyDto)
  company: Company;
}
