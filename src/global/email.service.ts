import { EmailDto } from './dtos/mail.dto';
import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly transport = nodemailer.createTransport({
    host: this.configService.get<string>('SMTP_HOST'),
    port: this.configService.get<number>('SMTP_PORT'),
    auth: {
      user: this.configService.get<string>('SMTP_USER'),
      pass: this.configService.get<string>('SMTP_PASSWORD'),
    },
  });

  constructor(private readonly configService: ConfigService) {}

  async sendMail({ To, Subject, Body }: EmailDto) {
    const params = {
      from: {
        name: 'Jobber App',
        address: this.configService.get<string>('SMTP_SENDER'),
      },
      to: [To],
      subject: Subject,
      text: Body,
      category: 'App Emails',
    };

    return this.transport.sendMail(params).then(console.log, console.error);
  }
}
