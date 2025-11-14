export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
}

export interface UsersCountResponse {
  count: number;
}

export interface DeletePostResponse {
  message: string;
}

export interface ApiError {
  error: string;
  message?: string;
}

