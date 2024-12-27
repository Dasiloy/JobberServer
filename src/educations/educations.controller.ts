import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Education')
@Controller({
  version: '1',
  path: 'educations',
})
export class EducationsController {
  createEducation() {}

  updateEducation() {}

  deleteEducation() {}
}
