import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Work history')
@Controller({
  version: '1',
  path: 'work-histories',
})
export class WorkHistoriesController {
  createExperience() {}

  updateExperience() {}

  deleteExperience() {}
}
