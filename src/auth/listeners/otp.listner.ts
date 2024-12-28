import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AuthEvents } from '../events';
import { SendEmailOtp, SendSmsOtp } from '../events/otp.events';
import { SmsService } from '@/global/sms.service';
import { EmailService } from '@/global/email.service';

@Injectable()
export class OtpEventListener {
  constructor(
    private readonly smsService: SmsService,
    private readonly mailerService: EmailService,
  ) {}

  @OnEvent(AuthEvents.SEND_EMAIL_OTP, {
    async: true,
  })
  async handleEmailEvent(event: SendEmailOtp) {
    const { user, ...rest } = event;
    try {
      this.mailerService.sendMail({
        ...rest,
        To: user.email,
      });
    } catch (error) {
      console.log('Error sending email', error);
    }
  }

  @OnEvent(AuthEvents.SEND_PHONE_OTP, {
    async: true,
  })
  async handlePhoneEvent(event: SendSmsOtp) {
    const { user, ...rest } = event;
    try {
      this.smsService.sendSms({
        ...rest,
        PhoneNumber: user.country_code.concat(user.phone_number),
      });
    } catch (error) {
      console.log('Error sending SMS', error);
    }
  }
}
