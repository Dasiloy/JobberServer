import { AddressDto } from '@/addons/dtos/address.dto';
import { DateComparison } from '@/addons/validators/date_comparism';
import { DateValidator } from '@/addons/validators/date_validator';
import { JobLocation, JobType } from '@/jobs/jobs.enum';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class UpdateProfileWorkHistoryDto {
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsEnum(JobType, {
    message(validationArguments) {
      return `The value '${validationArguments.value}' is not a valid JobType.`;
    },
  })
  job_type: JobType;

  @IsOptional()
  @IsString()
  @IsNotEmpty({
    message: 'Company name is required if company_id is not provided.',
  })
  company_name: string;

  @IsOptional()
  @ValidateNested({
    message: 'Company address is required if company_id is not provided.',
  })
  @Type(() => AddressDto)
  @IsNotEmpty()
  company_address: AddressDto;

  @IsOptional()
  @IsEnum(JobLocation, {
    message(validationArguments) {
      return `The value '${validationArguments.value}' is not a valid JobLocation.`;
    },
  })
  job_location: JobLocation;

  @DateValidator(false, { message: 'Start date must be a valid date.' })
  start_date: string;

  @DateComparison(
    {
      comparisonKey: 'start_date',
      comparisonType: 'greater',
      required: false,
    },
    {
      message: 'end_date must be a date greater than start_date',
    },
  )
  end_date: string;

  @IsOptional()
  @IsUUID('4')
  company_id: string;
}
