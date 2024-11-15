import { PaginationDto } from '@/global/dtos/pagination.dto';
import { IsOptional, IsUUID } from 'class-validator';

export class GetJobApplicationQueryDto extends PaginationDto {
  @IsOptional()
  @IsUUID('4')
  job_id: string;
}
