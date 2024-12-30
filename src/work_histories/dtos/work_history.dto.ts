import { Expose, Transform } from 'class-transformer';
import { JobLocation, JobType } from '@/jobs/jobs.enum';
import { Address } from '@/addons/interfaces/address.interface';

export class WorkHistoryDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  job_type: JobType;

  @Expose()
  job_location: JobLocation;

  @Expose()
  start_date: Date;

  @Expose()
  end_date: Date;

  @Expose()
  @Transform(({ obj }) => obj.company?.id || null)
  company_id: string | null;

  @Expose()
  @Transform(({ obj }) => obj.company?.name || obj.company_name)
  company_name: string | null;

  @Expose()
  @Transform(({ obj }) => obj.company?.logo || null)
  company_logo: string | null;

  @Expose()
  @Transform(({ obj }) => obj.company?.address || obj.company_address)
  company_address: Address;
}
