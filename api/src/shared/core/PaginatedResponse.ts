export interface PaginatedResponse<T> {
  totalCount: number;
  page: number;
  offset: number;
  items: T[];
}
