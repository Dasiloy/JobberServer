import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller({
  version: '1',
  path: 'notifications',
})
export class NotificationsController {}
