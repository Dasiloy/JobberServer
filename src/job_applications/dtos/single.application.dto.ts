import { Profile } from '@/profiles/profiles.entity';
import { ApplicationDto } from './application.dto';
import { Expose, Type } from 'class-transformer';
import { ApplicationProfileDto } from '@/profiles/dtos/application.profile.dto';

export class SingleApplicationDto extends ApplicationDto {
  @Expose()
  @Type(() => ApplicationProfileDto)
  profile: Profile;
}
