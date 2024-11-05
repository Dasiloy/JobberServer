import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RouteMeta } from './addons/enums/routes.enum';
import { SetRouteMeta } from './addons/decorators/routes.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @SetRouteMeta(RouteMeta.IS_PUBLIC)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
