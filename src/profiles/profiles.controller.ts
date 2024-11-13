import {
  Body,
  Post,
  Req,
  Session,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { ProfilesService } from './profiles.service';
import { CurrentUser } from '@/addons/decorators/current_user.decorator';
import { User } from '@/users/users.entity';
import { CreateProfileDto } from './dtos/create_profile.dto';
import { SetRouteMeta } from '@/addons/decorators/routes.decorator';
import { RouteMeta } from '@/addons/enums/routes.enum';
import { UpdateProfileDto } from './dtos/update_profile.dto';
import { Serialize } from '@/addons/decorators/serialize.decorator';
import { SingleUserDto } from '@/users/dtos/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileTypes } from '@/addons/constants/file.constants';
import { UploadFileWithValidators } from '@/addons/decorators/file.decorator';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @SetRouteMeta(RouteMeta.IS_PROFILE_AUTH_REQUIRED)
  @Serialize(SingleUserDto)
  @Post('')
  createProfile(
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
  @Serialize(SingleUserDto)
  @Post('/update')
  updateMyProfile(@Body() body: UpdateProfileDto, @CurrentUser() user: User) {
    return this.profilesService.updateMyProfile(body, user);
  }

  @SetRouteMeta(RouteMeta.IS_AUTH_REQUIRED)
  @Serialize(SingleUserDto)
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-resume')
  uploadResume(
    @CurrentUser() user: User,
    @UploadFileWithValidators(FileTypes.RESUME, 1024 * 1024 * 1)
    file: Express.Multer.File,
  ) {
    return this.profilesService.uploadResume(file, user);
  }
}
