import { Entity, ManyToOne, OneToOne } from 'typeorm';
import { PortfolioItem } from './portfolios_item.entity';
import { Profile } from '@/profiles/profiles.entity';
import { BaseEntity } from '@/base_entity';

@Entity()
export class Portfolio extends BaseEntity {
  @OneToOne(() => Profile, (profile) => profile.portfolio)
  profile: Profile;

  @ManyToOne(
    () => PortfolioItem,
    (portfolio_item) => portfolio_item.portfolio,
    { cascade: true, eager: true },
  )
  portfolio_items: PortfolioItem[];
}
