import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { UploadAvatarDto, UploadDto } from './dtos/upload.dto';

@Injectable()
export class UploadService {
  private readonly s3Client = new S3Client({
    region: this.configService.get<string>('AWS_REGION'),
  });
  constructor(private readonly configService: ConfigService) {}

  async uploadFile({ file, user, folder }: UploadDto) {
    const Key = `${user.id}/${folder}/${file.originalname}`;
    await this.s3Client.send(
      new PutObjectCommand({
        Key,
        Body: file.buffer,
        Bucket: 'jobberbucket',
        ContentType: file.mimetype,
      }),
    );

    return `/${folder}/${file.originalname}`;
  }

  async uploadAvatar({ file, user }: UploadAvatarDto) {
    const Key = `avatars/${user.id}/${file.originalname}`;
    await this.s3Client.send(
      new PutObjectCommand({
        Key,
        Body: file.buffer,
        Bucket: 'jobberpublicbucket',
        ContentType: file.mimetype,
      }),
    );

    return `https://jobberpublicbucket.s3.${this.configService.get<string>('AWS_REGION')}.amazonaws.com/${Key}`;
  }
}
