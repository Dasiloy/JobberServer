import { JobExperience, JobLocation, JobType } from '@/jobs/jobs.enum';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  resume_url: string;

  @IsOptional()
  @IsArray({ message: 'job_types must be an array' })
  @ArrayNotEmpty({ message: 'job_types cannot be empty' })
  @IsEnum(JobType, {
    each: true,
    message: 'Each job_type must be a valid JobType',
  })
  @ArrayUnique({ message: 'job_types must contain unique values' })
  job_types: JobType[];

  @IsOptional()
  @IsArray({ message: 'job_locations must be an array' })
  @ArrayNotEmpty({ message: 'job_locations cannot be empty' })
  @IsEnum(JobLocation, {
    each: true,
    message: 'Each job_location must be a valid JobLocation',
  })
  @ArrayUnique({ message: 'job_locations must contain unique values' })
  job_locations: JobLocation[];

  @IsOptional()
  @IsArray({ message: 'job_experiences must be an array' })
  @ArrayNotEmpty({ message: 'job_experiences cannot be empty' })
  @IsEnum(JobExperience, {
    each: true,
    message: 'Each job_experience must be a valid JobExperience',
  })
  @ArrayUnique({ message: 'job_experiences must contain unique values' })
  job_experiences: JobExperience[];
}
