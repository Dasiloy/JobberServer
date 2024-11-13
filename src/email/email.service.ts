import { Injectable } from '@nestjs/common';
import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { ConfigService } from '@nestjs/config';
import { EmailDto } from './dtos/mail.dto';

@Injectable()
export class EmailService {
  private readonly sesClient = new SESClient({
    region: this.configService.get<string>('AWS_REGION'),
  });

  constructor(private readonly configService: ConfigService) {}

  async sendMail({ To, Subject, Body }: EmailDto) {
    const params = {
      Destination: {
        ToAddresses: [To],
      },
      Message: {
        Body: {
          Text: {
            Data: Body,
          },
        },
        Subject: {
          Data: Subject,
        },
      },
      Source: this.configService.get<string>('AWS_IDENTITY'),
    };

    return this.sesClient.send(new SendEmailCommand(params));
  }
}
