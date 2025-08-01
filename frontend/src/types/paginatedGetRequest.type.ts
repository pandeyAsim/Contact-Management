export interface PaginatedGetRequest {
  page?: number;
  size?: number;
  sort?: string;
  order?: "asc" | "desc";
}
