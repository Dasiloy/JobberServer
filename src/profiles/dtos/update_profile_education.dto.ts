import { DateComparison } from '@/addons/validators/date_comparism';
import { DateValidator } from '@/addons/validators/date_validator';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileEducationDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  institution: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(128)
  degree: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(128)
  course: string;

  @DateValidator(false, { message: 'Start date must be a valid date.' })
  start_date: string;

  @DateComparison(
    {
      comparisonKey: 'start_date',
      comparisonType: 'greater',
      required: false,
    },
    {
      message: 'end_date when present  must be a date greater than start_date',
    },
  )
  end_date: string;
}
