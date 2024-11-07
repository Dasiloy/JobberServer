import { Body, Controller, Post, Req, Session } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CurrentUser } from '@/addons/decorators/current_user.decorator';
import { User } from '@/users/users.entity';
import { CreateProfileDto } from './dtos/create_profile.dto';
import { SetRouteMeta } from '@/addons/decorators/routes.decorator';
import { RouteMeta } from '@/addons/enums/routes.enum';
import { Request } from 'express';
import { UpdateProfileDto } from './dtos/update_profile.dto';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @SetRouteMeta(RouteMeta.IS_PROFILE_AUTH_REQUIRED)
  @Post('')
  create(
    @Body() body: CreateProfileDto,
    @CurrentUser() user: User,
    @Session() nestSession: any,
    @Req() request: Request,
  ) {
    return this.profilesService.createUserProfile(body, {
      user,
      request,
      nestSession,
    });
  }

  @SetRouteMeta(RouteMeta.IS_AUTH_REQUIRED)
  @Post('/update')
  updateMyProfile(@Body() body: UpdateProfileDto, @CurrentUser() user: User) {
    return this.profilesService.updateMyProfile(body, user);
  }

  @Post('upload-resume')
  async uploadResume() {
    // Implement the logic to upload a resume
  }
}
