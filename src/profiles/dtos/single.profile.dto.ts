import { Expose, Type } from 'class-transformer';
import { ProfileDto } from './profile.dto';
import { PortfolioDto } from '@/portfolios/dtos/portfolio.dto';
import { WorkHistoryDto } from '@/work_histories/dtos/work_history.dto';

export class SingleProfileDto extends ProfileDto {
  @Expose()
  @Type(() => PortfolioDto)
  portfolio: PortfolioDto;

  @Expose()
  @Type(() => WorkHistoryDto)
  work_history: WorkHistoryDto[];
}
