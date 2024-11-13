import { Injectable } from '@nestjs/common';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { ConfigService } from '@nestjs/config';
import { SmsDto } from './dtos/sms.dto';

@Injectable()
export class SmsService {
  private readonly snsClient = new SNSClient({
    region: this.configService.get<string>('AWS_REGION'),
  });

  constructor(private readonly configService: ConfigService) {}

  async sendSms({ Message, PhoneNumber, Subject }: SmsDto) {
    const res = await this.snsClient.send(
      new PublishCommand({
        Message,
        Subject,
        PhoneNumber,
      }),
    );
    return res;
  }
}
