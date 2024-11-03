import { Injectable } from '@nestjs/common';
import { PortfoliosItemsService } from './portfolios_item.service';

@Injectable()
export class PortfoliosService {
  constructor(private readonly portfolioItemsService: PortfoliosItemsService) {}
}
