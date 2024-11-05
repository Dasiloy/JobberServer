import {
  Body,
  ConflictException,
  Controller,
  Patch,
  Post,
  Req,
  Session,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { CurrentUser } from '@/addons/decorators/current_user.decorator';
import { User } from '@/users/users.entity';
import { CreateProfileDto } from './dtos/create_profile.dto';
import { SetRouteMeta } from '@/addons/decorators/routes.decorator';
import { RouteMeta } from '@/addons/enums/routes.enum';
import { Request } from 'express';

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
    if (user.profile) {
      throw new ConflictException(
        'You already have a profile. Update your profile instead.',
      );
    }

    return this.profilesService.createUserProfile(body, {
      user,
      request,
      nestSession,
    });
  }

  @Patch('/:id')
  update() {}

  @Post('upload-resume')
  async uploadResume() {
    // Implement the logic to upload a resume
  }
}
