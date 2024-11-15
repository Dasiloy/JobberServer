import { JobDto } from './Job.dto';
import { Expose, Transform } from 'class-transformer';

export class SingleJobDto extends JobDto {
  @Expose()
  @Transform(({ obj }) => obj.applications?.length || 0)
  applications_count: number;
}
