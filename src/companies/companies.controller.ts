import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { SetRouteMeta } from '@/addons/decorators/routes.decorator';
import { RouteMeta } from '@/addons/enums/routes.enum';
import { CurrentUser } from '@/addons/decorators/current_user.decorator';
import { User } from '@/users/users.entity';
import { FollowCompaniesDto } from './dtos/followcompany.dto';
import { Serialize } from '@/addons/decorators/serialize.decorator';
import { CompanyDto } from './dtos/company.dto';
import { PaginationDto } from '@/global/dtos/pagination.dto';
import { SingleCompanyDto } from './dtos/single.company.dto';
import { FollowCompanyDto } from './dtos/follow.company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @HttpCode(201)
  @SetRouteMeta(RouteMeta.IS_AUTH_REQUIRED)
  @Post('/load')
  loadCompanies(@Body() data: any) {
    return this.companiesService.loadCompanies(data?.companies);
  }

  @SetRouteMeta(RouteMeta.IS_AUTH_REQUIRED)
  @Serialize(FollowCompanyDto)
  @HttpCode(200)
  @Post('/follow')
  followCompanies(@CurrentUser() user: User, @Body() body: FollowCompaniesDto) {
    return this.companiesService.followCompanies(user, body.company_ids);
  }

  @SetRouteMeta(RouteMeta.IS_AUTH_REQUIRED)
  @Serialize(CompanyDto)
  @Get('')
  getAllCompanies(@Query() query: PaginationDto) {
    return this.companiesService.getCompanies(query);
  }

  @SetRouteMeta(RouteMeta.IS_AUTH_REQUIRED)
  @Serialize(SingleCompanyDto)
  @Get('/:id')
  getCompany(@Param('id') id: string) {
    return this.companiesService.getCompany(id);
  }
}
