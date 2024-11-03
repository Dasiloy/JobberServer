import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
// import { PortfoliosModule } from '@/portfolios/portfolios.module';

@Module({
  // imports: [PortfoliosModule],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
