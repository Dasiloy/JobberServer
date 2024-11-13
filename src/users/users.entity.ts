import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  OneToOne,
} from 'typeorm';
import { Role } from './users.enum';
import { Profile } from '@/profiles/profiles.entity';
import { Company } from '@/companies/companies.entity';
import { BaseEntity } from '@/base_entity';
import * as bcrypt from 'bcrypt';

@Entity()
@Index(['country_code', 'phone_number'], {
  unique: true,
})
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

  @Column('timestamp', {
    nullable: true,
  })
  email_verified_at: Date;

  @Column('int', {
    nullable: true,
  })
  email_token: number;

  @Column('timestamp', {
    nullable: true,
  })
  email_token_expired_at: Date;

  @Column('varchar', {
    nullable: false,
  })
  password: string;

  @Column('int', {
    nullable: true,
  })
  password_reset_token: number;

  @Column('timestamp', {
    nullable: true,
  })
  password_reset_token_expired_at: Date;

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

  @Column('timestamp', {
    nullable: true,
  })
  phone_number_verified_at: Date;

  @Column('int', {
    nullable: true,
  })
  phone_number_token: number;

  @Column('timestamp', {
    nullable: true,
  })
  phone_number_token_expired_at: Date;

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

  private current_password: string;

  @OneToOne(() => Profile, {
    cascade: true,
  })
  @JoinColumn()
  profile: Profile;

  @ManyToMany(() => Company, (company) => company.followers)
  followed_companies: Company[];

  comparePassword(password: string) {
    return bcrypt.compareSync(password, this.password);
  }

  @AfterLoad()
  loadCurrentPassword() {
    this.current_password = this.password;
  }

  @BeforeUpdate()
  hashPasswordOnPasswordChange() {
    if (this.current_password !== this.password) {
      this.password = bcrypt.hashSync(this.password, 10);
    }
    this.current_password = this.password;
  }

  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
