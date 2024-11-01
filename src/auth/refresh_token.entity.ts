import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Session } from './session.entity';
import { User } from '@/users/users.entity';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', {
    unique: true,
    length: 255,
    nullable: false,
  })
  token_key: string;

  @Column('boolean', {
    default: true,
  })
  valid: boolean;

  @OneToOne(() => User)
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @OneToOne(() => Session)
  @JoinColumn({
    name: 'session_id',
  })
  session: Session;
}
