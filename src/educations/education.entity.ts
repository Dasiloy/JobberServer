import { BaseEntity } from '@/base_entity';
import { Profile } from '@/profiles/profiles.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Education extends BaseEntity {
  @Column()
  institution: string;

  @Column()
  degree: string;

  @Column()
  courses: string;

  @Column('date')
  start_date: Date;

  @Column('date', {
    nullable: true,
  })
  end_date: Date;

  @ManyToOne(() => Profile, (profile) => profile.educations)
  profile: Profile;
}
