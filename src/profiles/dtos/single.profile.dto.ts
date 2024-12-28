import { Expose, Type } from 'class-transformer';
import { ProfileDto } from './profile.dto';
import { PortfolioDto } from '@/portfolios/dtos/portfolio.dto';

export class SingleProfileDto extends ProfileDto {
  @Expose()
  @Type(() => PortfolioDto)
  portfolio: PortfolioDto;
}
