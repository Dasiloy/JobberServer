import { PortfoliosService } from '@/portfolios/portfolios.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfilesService {
  constructor(private readonly portfolioService: PortfoliosService) {}
}
