import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PortfolioItem } from './portfolios_item.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class PortfoliosItemsService {
  constructor(
    @InjectRepository(PortfolioItem)
    private readonly repository: Repository<PortfolioItem>,
  ) {}

  findById(
    portfolioItemId: string,
    filters: FindOneOptions<PortfolioItem>['where'] = {},
    options: Omit<FindOneOptions<PortfolioItem>, 'where'> = {},
  ) {
    return this.repository.findOne({
      where: {
        id: portfolioItemId,
        ...filters,
      },
      ...options,
    });
  }

  createPortfolioItem() {
    return this.repository.create();
  }

  savePortfolioItem(portfolioItem: PortfolioItem) {
    return this.repository.save(portfolioItem);
  }

  deletePortfolioItem(portfolioItem: PortfolioItem) {
    return this.repository.remove(portfolioItem);
  }
}
