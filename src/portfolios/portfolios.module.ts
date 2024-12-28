import { Module } from '@nestjs/common';
import { PortfoliosService } from './portfolios.service';
import { PortfoliosItemsService } from './portfolios_item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from './portfolios.entity';
import { PortfolioItem } from './portfolios_item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Portfolio, PortfolioItem])],
  exports: [PortfoliosService, PortfoliosItemsService],
  controllers: [],
  providers: [PortfoliosService, PortfoliosItemsService],
})
export class PortfoliosModule {}
