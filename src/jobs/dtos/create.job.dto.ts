import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import {
  JobExperience,
  JobLocation,
  JobPayFrequency,
  JobType,
} from '../jobs.enum';

export class CreateJobDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1000000)
  pay: number;

  @IsNotEmpty()
  @IsEnum(JobPayFrequency, {
    message: 'Invalid pay frequency',
  })
  pay_frequency: JobPayFrequency;

  @IsNotEmpty()
  @IsString()
  about: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  requirements: string;

  @IsArray({ message: 'job_types must be an array' })
  @ArrayNotEmpty({ message: 'job_types cannot be empty' })
  @IsEnum(JobType, {
    each: true,
    message: 'Each job_type must be a valid JobType',
  })
  @ArrayUnique({ message: 'job_types must contain unique values' })
  types: JobType[];

  @IsArray({ message: 'job_locations must be an array' })
  @ArrayNotEmpty({ message: 'job_locations cannot be empty' })
  @IsEnum(JobLocation, {
    each: true,
    message: 'Each job_location must be a valid JobLocation',
  })
  @ArrayUnique({ message: 'job_locations must contain unique values' })
  locations: JobLocation[];

  @IsArray({ message: 'job_experiences must be an array' })
  @ArrayNotEmpty({ message: 'job_experiences cannot be empty' })
  @IsEnum(JobExperience, {
    each: true,
    message: 'Each job_experience must be a valid JobExperience',
  })
  @ArrayUnique({ message: 'job_experiences must contain unique values' })
  experiences: JobExperience[];

  @IsNotEmpty()
  @IsUUID('4')
  company_id: string;
}
