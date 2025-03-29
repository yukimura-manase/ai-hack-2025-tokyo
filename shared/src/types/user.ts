/**
 * ユーザー情報の型定義
 */
export interface User {
  userId: string;
  email: string;
  name: string;
  companyName: string;
  affiliation?: string;
  position?: string;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ユーザー作成時の入力データの型定義
 */
export interface CreateUserInput {
  email: string;
  name: string;
  companyName: string;
  affiliation?: string;
  position?: string;
}

/**
 * ユーザー更新時の入力データの型定義
 */
export interface UpdateUserInput {
  name?: string;
  companyName?: string;
  affiliation?: string | null;
  position?: string | null;
}
