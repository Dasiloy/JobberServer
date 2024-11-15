import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class JobApplyDto {
  @IsNotEmpty()
  @IsUUID('4')
  job_id: string;

  @IsOptional()
  @IsString()
  cover_letter: string;
}
