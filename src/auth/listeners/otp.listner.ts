import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AuthEvents } from '../events';
import { SmsService } from '@/sms/sms.service';
import { EmailService } from '@/email/email.service';
import { SendEmailOtp, SendSmsOtp } from '../events/otp.events';

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
    this.mailerService.sendMail({
      ...rest,
      To: user.email,
    });
  }

  @OnEvent(AuthEvents.SEND_PHONE_OTP, {
    async: true,
  })
  async handlePhoneEvent(event: SendSmsOtp) {
    const { user, ...rest } = event;
    this.smsService.sendSms({
      ...rest,
      PhoneNumber: `+${user.country_code}${user.phone_number}`,
    });
  }
}
