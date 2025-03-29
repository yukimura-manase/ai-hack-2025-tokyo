/**
 * API レスポンスの共通型定義
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * ページネーション情報の型定義
 */
export interface PaginationInfo {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

/**
 * ページネーション付きレスポンスの型定義
 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}
