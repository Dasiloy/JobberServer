import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '@/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './session.entity';
import { RefreshToken } from './refresh_token.entity';
import { OtpEventListener } from './listeners/otp.listner';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Session, RefreshToken]),
    JwtModule.register({
      global: true,
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    OtpEventListener,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
