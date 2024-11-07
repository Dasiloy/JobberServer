import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { SetRouteMeta } from '@/addons/decorators/routes.decorator';
import { RouteMeta } from '@/addons/enums/routes.enum';
import { CurrentUser } from '@/addons/decorators/current_user.decorator';
import { User } from '@/users/users.entity';
import { FollowCompaniesDto } from './dtos/followcompany.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @HttpCode(201)
  @SetRouteMeta(RouteMeta.IS_AUTH_REQUIRED)
  @Post('/load')
  async loadCompanies(@Body() data: any) {
    return this.companiesService.loadCompanies(data?.companies);
  }

  @HttpCode(200)
  @SetRouteMeta(RouteMeta.IS_AUTH_REQUIRED)
  @Post('/follow')
  async followCompanies(
    @CurrentUser() user: User,
    @Body() body: FollowCompaniesDto,
  ) {
    return this.companiesService.followCompanies(user, body.company_ids);
  }

  @SetRouteMeta(RouteMeta.IS_AUTH_REQUIRED)
  @Get('')
  async getAllCompanies() {
    return this.companiesService.getCompanies();
  }
}
