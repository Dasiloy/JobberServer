import { Address } from '@/addons/interfaces/address.interface';
import { Expose, Transform } from 'class-transformer';

export class FollowCompanyDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
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
  @Transform(({ obj }) => obj.followers.length)
  followers_count: number;
}
