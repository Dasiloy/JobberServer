import { IsEnum, IsNotEmpty } from 'class-validator';
import { JobProfession } from '../../jobs/jobs.enum';

export class CreateProfileDto {
  @IsNotEmpty()
  @IsEnum(JobProfession, {
    message: 'job_profession must be valid',
  })
  job_profession: JobProfession;
}
