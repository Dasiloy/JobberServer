import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { SetRouteMeta } from '@/addons/decorators/routes.decorator';
import { RouteMeta } from '@/addons/enums/routes.enum';
import { CurrentUser } from '@/addons/decorators/current_user.decorator';
import { User } from '@/users/users.entity';
import { FollowCompaniesDto } from './dtos/followcompany.dto';
import { Serialize } from '@/addons/decorators/serialize.decorator';
import { CompanyDto, SingleCompanyDto } from './dtos/company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @HttpCode(201)
  @SetRouteMeta(RouteMeta.IS_AUTH_REQUIRED)
  @Post('/load')
  async loadCompanies(@Body() data: any) {
    return this.companiesService.loadCompanies(data?.companies);
  }

  @SetRouteMeta(RouteMeta.IS_AUTH_REQUIRED)
  @Serialize(CompanyDto)
  @HttpCode(200)
  @Post('/follow')
  async followCompanies(
    @CurrentUser() user: User,
    @Body() body: FollowCompaniesDto,
  ) {
    return this.companiesService.followCompanies(user, body.company_ids);
  }

  @SetRouteMeta(RouteMeta.IS_AUTH_REQUIRED)
  @Serialize(CompanyDto)
  @Get('')
  getAllCompanies() {
    return this.companiesService.getCompanies();
  }

  @SetRouteMeta(RouteMeta.IS_AUTH_REQUIRED)
  @Serialize(SingleCompanyDto)
  @Get('/:id')
  getCompany(@Param('id') id: string) {
    return this.companiesService.getCompany(id);
  }
}
