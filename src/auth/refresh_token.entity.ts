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

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @OneToOne(() => Session, (session) => session.refresh_token, {
    onDelete: 'CASCADE',
  })
  session: Session;
}
