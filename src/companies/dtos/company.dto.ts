import { Address } from '@/addons/interfaces/address.interface';
import { User } from '@/users/users.entity';
import { Expose, Transform } from 'class-transformer';

export class CompanyDto {
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

export class SingleCompanyDto extends CompanyDto {
  @Expose()
  @Transform(({ obj }) => {
    return obj.followers.length;
  })
  followers_count: number;

  @Expose()
  @Transform(({ obj }) => {
    return obj.followers.map((f: User) => ({
      id: f.id,
      email: f.email,
      name: `${f.first_name} ${f.last_name}`,
      full_phone_number: f.country_code + f.phone_number,
    }));
  })
  company_followers: User[];
}
