import { Address } from '@/addons/interfaces/address.interface';
import { BaseEntity } from '@/base_entity';
import { Company } from '@/companies/companies.entity';
import { JobLocation, JobType } from '@/jobs/jobs.enum';
import { Profile } from '@/profiles/profiles.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class WorkHistory extends BaseEntity {
  @Column('varchar', {
    nullable: false,
    length: 255,
  })
  title: string;

  @Column('enum', {
    enum: JobType,
    nullable: false,
  })
  job_type: JobType;

  @Column('varchar', {
    nullable: true,
    length: 255,
  })
  company_name: string;

  @Column('enum', {
    enum: JobLocation,
    nullable: false,
  })
  job_location: JobLocation;

  @Column('simple-json', {
    nullable: true,
  })
  company_address: Address;

  @Column('date')
  start_date: Date;

  @Column('date', {
    nullable: true,
  })
  end_date: Date;

  @ManyToOne(() => Profile, (profile) => profile.work_history)
  profile: Profile;

  @ManyToOne(() => Company, (company) => company.employments, {
    cascade: true,
  })
  company: Company;
}
