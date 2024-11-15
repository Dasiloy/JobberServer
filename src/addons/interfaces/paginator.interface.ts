export interface Paginate {
  count: number;
  page: number;
  limit: number;
  page_size: number;
}

export interface PaginatePayload {
  page: number;
  limit: number;
  total: number;
  last_page: number;
  page_size: number;
}
