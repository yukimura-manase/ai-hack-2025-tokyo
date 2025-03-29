import { SERVER_URL } from "@/constants/env";
import {
  ThreadRes,
  ThreadResList,
} from "@chemical-data-search-ai-agent/shared";

/**
 * Thread APIクライアント
 */
export const threadApi = {
  /**
   * スレッド一覧を取得する
   * @param userId ユーザーID
   * @returns スレッド一覧
   */
  getThreads: async (userId: string): Promise<ThreadResList> => {
    const response = await fetch(`${SERVER_URL}/api/threads`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": userId,
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "スレッド一覧の取得に失敗しました");
    }

    return await response.json();
  },

  /**
   * 新しいスレッドを作成する
   * @param userId ユーザーID
   * @returns 作成されたスレッド
   */
  createThread: async (userId: string): Promise<ThreadRes> => {
    const response = await fetch(`${SERVER_URL}/api/threads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": userId,
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "スレッドの作成に失敗しました");
    }

    return await response.json();
  },

  /**
   * スレッド詳細を取得する
   * @param threadId スレッドID
   * @param userId ユーザーID
   * @returns スレッド詳細
   */
  getThread: async (threadId: string, userId: string): Promise<ThreadRes> => {
    const response = await fetch(`${SERVER_URL}/api/threads/${threadId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": userId,
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "スレッドの取得に失敗しました");
    }

    return await response.json();
  },

  /**
   * スレッド内のメッセージ一覧を取得する
   * @param threadId スレッドID
   * @param userId ユーザーID
   * @returns メッセージ一覧
   */
  getMessages: async (threadId: string, userId: string) => {
    const response = await fetch(
      `${SERVER_URL}/api/threads/${threadId}/messages`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": userId,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "メッセージの取得に失敗しました");
    }

    return await response.json();
  },

  /**
   * スレッドのタイトルを更新する
   * @param threadId スレッドID
   * @param userId ユーザーID
   * @param title 新しいタイトル
   * @returns 更新されたスレッド
   */
  updateThreadTitle: async (
    threadId: string,
    userId: string,
    title: string
  ): Promise<ThreadRes> => {
    const response = await fetch(`${SERVER_URL}/api/threads/${threadId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": userId,
      },
      credentials: "include",
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "スレッドタイトルの更新に失敗しました"
      );
    }

    return await response.json();
  },
};
