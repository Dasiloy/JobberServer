import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { User } from '@/users/users.entity';
import { Address } from '@/addons/interfaces/address.interface';
import { Job } from '@/jobs/jobs.entity';
import { BaseEntity } from '@/base_entity';
import { WorkHistory } from '@/work_histories/work_histories.entity';

@Entity()
export class Company extends BaseEntity {
  @Column('varchar', { length: 255 })
  name: string;

  @Column('simple-json', {
    nullable: true,
  })
  address: Address;

  @Column({
    nullable: true,
  })
  logo: string;

  @Column({
    default: false,
  })
  is_popular: boolean;

  @Column('date', {
    nullable: true,
  })
  established_at: Date;

  @Column('int', {
    default: 0,
  })
  employees_count: number;

  @ManyToMany(() => User, (user) => user.followed_companies, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinTable()
  followers: User[];

  @OneToMany(() => Job, (job) => job.company)
  jobs: Job[];

  @OneToMany(() => WorkHistory, (workHistory) => workHistory.company)
  employments: WorkHistory[];
}
