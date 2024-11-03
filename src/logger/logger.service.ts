import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private static instance: LoggerService | null = null;

  constructor() {
    if (!LoggerService.instance) {
      LoggerService.instance = this;
    }
    return LoggerService.instance;
  }
  log(message: string) {
    console.log(message);
  }

  error(message: string) {
    console.error(message);
  }

  info(message: string) {
    console.log(
      JSON.stringify(`${new Date().toISOString()} - ${message}`, null, 2),
    );
  }
}
