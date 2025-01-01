import { BaseEntity } from '@/base_entity';
import { Profile } from '@/profiles/profiles.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Education extends BaseEntity {
  @Column('varchar', { length: 255, nullable: false })
  institution: string;

  @Column('varchar', { length: 128, nullable: false })
  degree: string;

  @Column('varchar', { length: 128, nullable: false })
  course: string;

  @Column('date', {
    nullable: false,
  })
  start_date: Date;

  @Column('date', {
    nullable: true,
  })
  end_date: Date;

  @ManyToOne(() => Profile, (profile) => profile.educations)
  profile: Profile;
}
