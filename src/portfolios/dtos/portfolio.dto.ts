import { Expose, Type } from 'class-transformer';
import { PortFolioItemDto } from './portfolio_item.dto';

export class PortfolioDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => PortFolioItemDto)
  portfolio_items: PortFolioItemDto[];
}
