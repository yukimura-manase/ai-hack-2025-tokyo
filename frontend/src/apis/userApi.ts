import { SERVER_URL } from "@/constants/env";
import { User } from "@chemical-data-search-ai-agent/shared";

/**
 * User APIクライアント
 */
export const userApi = {
  /**
   * Google認証情報を検証する
   * @param email メールアドレス
   * @returns ユーザーが存在するかどうか
   */
  verifyGoogleAuth: async (
    email: string
  ): Promise<{
    exists: boolean;
    user: User | null;
  }> => {
    const response = await fetch(`${SERVER_URL}/api/users/verify-google-auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Failed to verify Google auth");
    }

    return response.json();
  },

  /**
   * ユーザーを新規登録する
   * @param userData ユーザーデータ
   * @returns 新規登録したユーザー
   */
  registerUser: async (userData: {
    name: string;
    email: string;
    companyName: string;
    affiliation?: string;
    position?: string;
    googleId?: string;
  }) => {
    const response = await fetch(`${SERVER_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to register user");
    }

    return response.json();
  },

  /**
   * ユーザー情報を取得する
   * @param userId ユーザーID
   * @returns ユーザー情報
   */
  getUser: async (userId: string) => {
    const response = await fetch(`${SERVER_URL}/api/users/${userId}`);

    if (!response.ok) {
      throw new Error("Failed to get user");
    }

    return response.json();
  },

  /**
   * ユーザー情報を更新する
   * @param userId ユーザーID
   * @param userData 更新するユーザーデータ
   * @returns 更新されたユーザー情報
   */
  updateUser: async (
    userId: string,
    userData: {
      name?: string;
      companyName?: string;
      affiliation?: string | null;
      position?: string | null;
    }
  ) => {
    const response = await fetch(`${SERVER_URL}/api/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    return response.json();
  },
};
