import { Address } from '@/addons/interfaces/address.interface';
import { Expose } from 'class-transformer';

export class JobCompanyDto {
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
}
