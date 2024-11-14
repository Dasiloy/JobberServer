import { PaginatePayload } from './paginator.interface';

interface Response<T> {
  message: string;
  data?: T;
  pagination?: PaginatePayload;
  access_token?: string;
}

export type ServerResponse<T> = Promise<Response<T>>;
