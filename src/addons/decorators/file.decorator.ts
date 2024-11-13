import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
} from '@nestjs/common';

export const UploadFileWithValidators = (fileType: any, maxSize: number) =>
  UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize }),
        new FileTypeValidator({
          fileType,
        }),
      ],
    }),
  );
