import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export interface Paginate {
  count: number;
  page: number;
  limit: number;
  page_size: number;
}

export interface PaginatePayload {
  page: number;
  limit: number;
  total: number;
  last_page: number;
  page_size: number;
}

export class PaginationDto {
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = 1;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsInt()
  @Min(1)
  limit: number = 10;
}
