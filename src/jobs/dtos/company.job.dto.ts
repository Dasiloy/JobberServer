import { JobStatus } from 'aws-sdk/clients/batch';
import { Expose } from 'class-transformer';
import { JobExperience, JobLocation, JobPayFrequency } from '../jobs.enum';
import { JobType } from 'aws-sdk/clients/importexport';

export class CompanyJobDto {
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
}
