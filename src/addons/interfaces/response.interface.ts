import { PaginatePayload } from './paginator.interface';

export interface StandardErrorResponse {
  status: number;
  timestamp: string;
  path: string;
  message: string;
}

export interface StandardResponse<T = undefined> {
  data?: T;
  message: string;
  access_token?: string;
  pagination?: PaginatePayload;
}

export type ServerResponse<T = undefined> = Promise<StandardResponse<T>>;
