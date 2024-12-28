import { Entity, OneToMany } from 'typeorm';
import { PortfolioItem } from '@/portfolios/portfolios_item.entity';
import { BaseEntity } from '@/base_entity';

@Entity()
export class Portfolio extends BaseEntity {
  @OneToMany(() => PortfolioItem, (portfolioItem) => portfolioItem.portfolio, {
    cascade: true,
    nullable: true,
    eager: true,
  })
  portfolio_items: PortfolioItem[];
}
