import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { SerializeMeta } from '../decorators/serialize.decorator';
import { plainToInstance } from 'class-transformer';
import { ClassInterface } from '../interfaces/class.interface';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const dto = this.reflector.getAllAndOverride<ClassInterface>(
      SerializeMeta,
      [context.getClass(), context.getHandler()],
    );

    return next.handle().pipe(
      map((response) => {
        if (!response?.data || !dto) {
          return response;
        }

        return {
          ...response,
          data: plainToInstance(dto, response.data, {
            excludeExtraneousValues: true,
          }),
        };
      }),
    );
  }
}
