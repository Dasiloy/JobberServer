import { AddressDto } from '@/addons/dtos/address.dto';
import { DateComparison } from '@/addons/validators/date_comparism';
import { DateValidator } from '@/addons/validators/date_validator';
import { JobLocation, JobType } from '@/jobs/jobs.enum';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class CreateProfileWorkHistoryDto {
  @IsString()
  @MinLength(4)
  @MaxLength(255)
  title: string;

  @IsEnum(JobType, {
    message(validationArguments) {
      return `The value '${validationArguments.value}' is not a valid JobType.`;
    },
  })
  job_type: JobType;

  @ValidateIf((o) => !o.company_id)
  @IsString()
  @IsNotEmpty({
    message: 'Company name is required if company_id is not provided.',
  })
  company_name: string;

  @ValidateIf((o) => !o.company_id)
  @ValidateNested({
    message: 'Company address is required if company_id is not provided.',
  })
  @Type(() => AddressDto)
  @IsNotEmpty()
  company_address: AddressDto;

  @IsEnum(JobLocation, {
    message(validationArguments) {
      return `The value '${validationArguments.value}' is not a valid JobLocation.`;
    },
  })
  job_location: JobLocation;

  @DateValidator(true, { message: 'Start date must be a valid date.' })
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

  @ValidateIf((o) => !o.company_name && !o.address)
  @IsUUID('4')
  company_id: string;
}
