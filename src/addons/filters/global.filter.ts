import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseMessage: any = exception.getResponse();

      // Handle validation errors (array of errors)
      if (Array.isArray(responseMessage?.message)) {
        message = responseMessage.message.join(', '); // Combine array into a single string
      } else {
        // Ensure message is always a string for other HttpException cases
        message =
          typeof responseMessage === 'string'
            ? responseMessage
            : responseMessage?.message;
      }
    } else if (exception instanceof QueryFailedError) {
      // Handle database-specific errors
      const dbError = (exception as QueryFailedError).message;
      if (dbError.includes('duplicate key value violates unique constraint')) {
        status = HttpStatus.CONFLICT;
        message = 'Already exists';
      } else {
        message = 'An error occurred.';
      }
    } else if (exception instanceof Error) {
      // Handle generic Error instances
      message = exception.message || 'An unknown error occurred.';
    }

    response.status(status).json({
      status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
