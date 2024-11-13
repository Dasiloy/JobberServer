import { Module } from '@nestjs/common';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';
import { PortfoliosModule } from '@/portfolios/portfolios.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './profiles.entity';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';
import { UploadModule } from '@/upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
    AuthModule,
    UsersModule,
    PortfoliosModule,
    UploadModule,
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
