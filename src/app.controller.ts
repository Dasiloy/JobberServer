import { Controller, Get } from '@nestjs/common';
import { SetRouteMeta } from './addons/decorators/routes.decorator';
import { RouteMeta } from './addons/enums/routes.enum';
import { ServerResponse } from './addons/interfaces/response.interface';

@Controller({
  version: '1',
  path: '/',
})
export class AppController {
  @SetRouteMeta(RouteMeta.IS_PUBLIC)
  @Get('')
  async getDefault(): ServerResponse {
    return {
      message: 'Welcome to Jobber App Api',
    };
  }
}
