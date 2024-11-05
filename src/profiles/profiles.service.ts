import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from './profiles.entity';
import { Repository } from 'typeorm';
import { AuthService } from '@/auth/auth.service';
import { CreateSessionDto } from '@/auth/dtos/create_seession.dto';
import { UsersService } from '@/users/users.service';
import { PortfoliosService } from '@/portfolios/portfolios.service';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile) private readonly repository: Repository<Profile>,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly portfolioService: PortfoliosService,
  ) {}

  async createUserProfile(
    data: Partial<Profile>,
    { user, nestSession, request }: CreateSessionDto,
  ) {
    const access_token = await this.authService.createSession({
      user,
      nestSession,
      request,
    });
    const profile = this.repository.create({
      ...data,
    });
    user.profile = profile;
    await this.usersService.saveUser(user);

    return {
      access_token,
      data: profile,
    };
  }
}
