import {
  Paginate,
  PaginatePayload,
} from '@/addons/interfaces/paginator.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginatorService {
  paginate({ count, limit, page, page_size }: Paginate): PaginatePayload {
    return {
      page,
      limit,
      page_size,
      total: count,
      last_page: Math.ceil(count / limit),
    };
  }
}
