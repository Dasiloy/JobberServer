import { Column, Entity, ManyToOne } from 'typeorm';
import { Portfolio } from '@/portfolios/portfolios.entity';
import { BaseEntity } from '@/base_entity';

@Entity()
export class PortfolioItem extends BaseEntity {
  @Column('varchar', { length: 255 })
  title: string;

  @Column('text')
  description: string;

  @Column('varchar', { length: 255 })
  portfolio_item_url: string;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.portfolio_items)
  portfolio: Portfolio;
}
