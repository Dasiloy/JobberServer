import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Portfolio } from './portfolios.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PortfoliosService {
  constructor(
    @InjectRepository(Portfolio)
    private readonly portfolioRepository: Repository<Portfolio>,
  ) {}

  async createPortfolio() {
    const portfolio = this.portfolioRepository.create();
    return this.portfolioRepository.save(portfolio);
  }
}
