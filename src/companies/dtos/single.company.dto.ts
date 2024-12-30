import { Address } from '@/addons/interfaces/address.interface';
import { UserDto } from '@/users/dtos/user.dto';
import { User } from '@/users/users.entity';
import { Expose, Type } from 'class-transformer';
import { Company } from '../companies.entity';
import { CompanyJobDto } from '@/jobs/dtos/company.job.dto';
import { CompanyWorkHistoryDto } from '@/work_histories/dtos/company_work_history.dto';

export class SingleCompanyDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  address: Address;

  @Expose()
  logo: string;

  @Expose()
  is_popular: boolean;

  @Expose()
  established_at: Date;

  @Expose()
  employees_count: number;

  @Expose()
  @Type(() => UserDto)
  followers: User[];

  @Expose()
  @Type(() => CompanyWorkHistoryDto)
  employments: CompanyWorkHistoryDto[];

  @Expose()
  @Type(() => CompanyJobDto)
  jobs: Company[];
}
