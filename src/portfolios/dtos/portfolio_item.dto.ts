import { Expose } from 'class-transformer';

export class PortFolioItemDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  portfolio_item_url: string;
}
