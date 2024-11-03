import { Module } from '@nestjs/common';
import { PortfoliosService } from './portfolios.service';
import { PortfoliosItemsService } from './portfolios_item.service';

@Module({
  imports: [],
  exports: [PortfoliosService],
  controllers: [],
  providers: [PortfoliosService, PortfoliosItemsService],
})
export class PortfoliosModule {}
