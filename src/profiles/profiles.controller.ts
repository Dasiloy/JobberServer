import {
  Body,
  Post,
  Req,
  Session,
  Controller,
  UseInterceptors,
  Get,
  Patch,
  Delete,
  Param,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { FileTypes } from '@/addons/constants/file.constants';
import { UploadFileWithValidators } from '@/addons/decorators/file.decorator';
import { ProfileDto } from './dtos/profile.dto';
import { ApiTags } from '@nestjs/swagger';
import { SingleProfileDto } from './dtos/single.profile.dto';
import { CreateProfilePortfolioItemDto } from './dtos/create_profile_portfolio_item.dto';
import { PortFolioItemDto } from '@/portfolios/dtos/portfolio_item.dto';
import { UpdateProfilePortfolioItemDto } from './dtos/update_profile_portfolio_item.dto';

@ApiTags('Profiles')
@Controller({
  version: '1',
  path: 'profiles',
})
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @SetRouteMeta(RouteMeta.IS_PROFILE_AUTH_REQUIRED)
  @Serialize(ProfileDto)
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
  @Serialize(ProfileDto)
  @Post('/update')
  updateMyProfile(@Body() body: UpdateProfileDto, @CurrentUser() user: User) {
    return this.profilesService.updateMyProfile(body, user);
  }

  @SetRouteMeta(RouteMeta.IS_AUTH_REQUIRED)
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-resume')
  uploadResume(
    @CurrentUser() user: User,
    @UploadFileWithValidators(FileTypes.RESUME, 1024 * 1024 * 1)
    file: Express.Multer.File,
  ) {
    return this.profilesService.uploadResume(file, user);
  }

  @SetRouteMeta(RouteMeta.IS_AUTH_REQUIRED)
  @UseInterceptors(FileInterceptor('file'))
  @Post('upload-portfolio-item')
  uploadPortfolioItem(
    @CurrentUser() user: User,
    @UploadFileWithValidators(FileTypes.PORTFOLIO_ITEMS, 1024 * 1024 * 1)
    file: Express.Multer.File,
  ) {
    return this.profilesService.uploadPortfolioItem(file, user);
  }

  @SetRouteMeta(RouteMeta.IS_AUTH_REQUIRED)
  @Serialize(PortFolioItemDto)
  @Post('portfolio-items')
  createProfilePortfolioItem(
    @Body() data: CreateProfilePortfolioItemDto,
    @CurrentUser() user: User,
  ) {
    return this.profilesService.createProfilePortfolioItem(data, user);
  }

  @SetRouteMeta(RouteMeta.IS_AUTH_REQUIRED)
  @Serialize(PortFolioItemDto)
  @Patch('portfolio-items/:id')
  updateProfilePortfolioItem(
    @Param('id') id: string,
    @Body() data: UpdateProfilePortfolioItemDto,
    @CurrentUser() user: User,
  ) {
    return this.profilesService.updatePortfolioItem(id, data, user);
  }

  @SetRouteMeta(RouteMeta.IS_AUTH_REQUIRED)
  @Delete('portfolio-items/:id')
  deleteProfilePortfolioItem(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ) {
    return this.profilesService.deletePortfolioItem(id, user);
  }

  @SetRouteMeta(RouteMeta.IS_AUTH_REQUIRED)
  @Serialize(SingleProfileDto)
  @Get('me')
  getMyProfile(@CurrentUser() user: User) {
    return this.profilesService.getCurrentUserProfile(user);
  }
}
