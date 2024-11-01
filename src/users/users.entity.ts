import { Column, Entity, JoinColumn, ManyToMany, OneToOne } from 'typeorm';
import { Role } from './users.enum';
import { Profile } from '@/profiles/profiles.entity';
import { Company } from '@/companies/companies.entity';
import { BaseEntity } from '@/base_entity';

@Entity()
export class User extends BaseEntity {
  @Column('varchar', {
    length: 255,
    nullable: false,
  })
  first_name: string;

  @Column('varchar', {
    length: 255,
    nullable: false,
  })
  last_name: string;

  @Column('varchar', {
    length: 255,
    unique: true,
    nullable: false,
  })
  email: string;

  @Column('boolean', {
    default: false,
  })
  email_verified: boolean;

  @Column('datetime', {
    nullable: true,
  })
  email_verified_at: Date;

  @Column('varchar', {
    nullable: false,
    select: false,
  })
  password: string;

  @Column('varchar', {
    length: 10,
    nullable: true,
  })
  country_code: string;

  @Column('varchar', {
    length: 20,
    nullable: true,
  })
  phone_number: string;

  @Column('boolean', {
    default: false,
  })
  phone_number_verified: boolean;

  @Column('datetime', {
    nullable: true,
  })
  phone_number_verified_at: Date;

  @Column('boolean', {
    default: false,
  })
  id_verified: boolean;

  @Column('boolean', {
    default: true,
  })
  active: boolean;

  @Column('boolean', {
    default: false,
  })
  deleted: boolean;

  @Column('varchar', {
    length: 255,
    nullable: true,
  })
  profile_pic: string;

  @Column('enum', {
    enum: Role,
    default: Role.JOB_SEEKER,
  })
  role: Role;

  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
  })
  @JoinColumn()
  profile: Profile;

  @ManyToMany(() => Company, (company) => company.followers)
  followed_companies: Company[];
}
