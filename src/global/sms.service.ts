import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SmsDto } from './dtos/sms.dto';
import axios from 'axios';

@Injectable()
export class SmsService {
  private readonly termiiClient = axios.create({
    baseURL: this.configService.get<string>('TERMII_BASE_URL'),
    headers: {
      'Content-Type': ['application/json', 'application/json'],
    },
  });
  constructor(private readonly configService: ConfigService) {}

  async sendSms({ Message, PhoneNumber, Subject }: SmsDto) {
    try {
      return await this.termiiClient.post<any>('/api/sms/send', {
        type: 'plain',
        channel: 'generic',
        to: PhoneNumber,
        sms: `
          Subject: ${Subject}
          \n
          ${Message}
        `,
        from: this.configService.get<string>('TERMII_SENDER_ID'),
        api_key: this.configService.get<string>('TERMII_API_KEY'),
      });
    } catch (error) {
      console.log('Error sending SMS', error);
    }
  }
}
