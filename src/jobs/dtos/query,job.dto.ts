import {
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
  ArrayUnique,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  JobExperience,
  JobLocation,
  JobPayFrequency,
  JobType,
  JobStatus,
} from '../jobs.enum';
import { BadRequestException } from '@nestjs/common';
import { PaginationDto } from '@/global/dtos/pagination.dto';

export class QueryJobDto extends PaginationDto {
  @IsOptional()
  @IsString({ message: 'Title must be a text value.' })
  title: string;

  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const range = value.split(',').map((v) => {
        const parsedValue = parseInt(v, 10);
        if (isNaN(parsedValue)) {
          throw new BadRequestException(
            `Invalid pay range value "${v}". Must be a number.`,
          );
        }
        return parsedValue;
      });

      if (range.length !== 2) {
        throw new BadRequestException(
          'Pay range should contain exactly two values separated by a comma.',
        );
      }

      if (range[0] >= range[1]) {
        throw new BadRequestException(
          'The first pay range value must be less than the second value.',
        );
      }

      return range;
    }
    return value;
  })
  @IsOptional()
  pay_range: number[];

  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsOptional()
  @IsArray({ message: 'Job types should be a comma-separated list.' })
  @IsEnum(JobType, {
    each: true,
    message: 'Each job type must be a valid JobType.',
  })
  @ArrayUnique({ message: 'Job types must contain unique values.' })
  job_types: JobType[];

  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsOptional()
  @IsArray({ message: 'Job statuses should be a comma-separated list.' })
  @IsEnum(JobStatus, {
    each: true,
    message: 'Each job status must be a valid JobStatus.',
  })
  @ArrayUnique({ message: 'Job statuses must contain unique values.' })
  statuses: JobStatus[];

  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsOptional()
  @IsArray({ message: 'Job locations should be a comma-separated list.' })
  @IsEnum(JobLocation, {
    each: true,
    message: 'Each job location must be a valid JobLocation.',
  })
  locations: JobLocation[];

  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsOptional()
  @IsArray({ message: 'Job experiences should be a comma-separated list.' })
  @IsEnum(JobExperience, {
    each: true,
    message: 'Each job experience must be a valid JobExperience.',
  })
  experiences: JobExperience[];

  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsOptional()
  @IsArray({ message: 'Pay frequencies should be a comma-separated list.' })
  @IsEnum(JobPayFrequency, {
    each: true,
    message: 'Each pay frequency must be a valid JobPayFrequency.',
  })
  pay_frequencies: JobPayFrequency[];

  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsOptional()
  @IsArray({ message: 'Company IDs should be a comma-separated list.' })
  @IsUUID('4', { each: true, message: 'Each company ID must be a valid UUID.' })
  company_ids: string[];
}
