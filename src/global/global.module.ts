import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';
import { UploadService } from './upload.service';
import { UtilsService } from './utils.service';
import { PaginatorService } from './pagination.service';

@Global()
@Module({
  providers: [
    EmailService,
    SmsService,
    UploadService,
    UtilsService,
    PaginatorService,
  ],
  exports: [
    EmailService,
    SmsService,
    UploadService,
    UtilsService,
    PaginatorService,
  ],
})
export class GlobalModule {}
