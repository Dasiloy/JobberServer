import { User } from '@/users/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { RefreshToken } from './refresh_token.entity';

@Entity()
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    nullable: true,
  })
  ip: string;

  @Column('boolean', {
    default: true,
  })
  valid: boolean;

  @Column('text', {
    nullable: true,
  })
  user_agent: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => RefreshToken, (refresh_token) => refresh_token.session, {
    cascade: true,
  })
  @JoinColumn()
  refresh_token: RefreshToken;
}
