import { Injectable } from '@nestjs/common';
import { Paginate, PaginatePayload } from '../interfaces/paginator.interface';

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
