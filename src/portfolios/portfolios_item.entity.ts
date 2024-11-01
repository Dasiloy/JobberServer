import { Column, Entity, OneToMany } from 'typeorm';
import { Portfolio } from './portfolios.entity.';
import { BaseEntity } from '@/base_entity';

@Entity()
export class PortfolioItem extends BaseEntity {
  @Column('varchar', { length: 255 })
  title: string;

  @Column('text', {
    nullable: true,
  })
  description: string;

  @Column('varchar', { length: 255 })
  portfolio_item_url: string;

  @OneToMany(() => Portfolio, (portfolio) => portfolio.portfolio_items)
  portfolio: Portfolio;
}
