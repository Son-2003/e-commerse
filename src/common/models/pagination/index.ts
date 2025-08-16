export interface ResponseEntityPagination<T> {
  pageNo: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  last: boolean;
  content: T[];
}
