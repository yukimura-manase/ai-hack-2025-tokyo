import { SERVER_URL } from "@/constants/env";
import { MessageRes } from "@chemical-data-search-ai-agent/shared";

/**
 * Message APIクライアント
 */
export const messageApi = {
  /**
   * メッセージを送信し、AI応答を取得する
   * @param threadId スレッドID
   * @param userId ユーザーID
   * @param content メッセージ内容
   * @returns [ユーザーメッセージ, AI応答メッセージ]
   */
  sendMessage: async (
    threadId: string,
    userId: string,
    content: string
  ): Promise<MessageRes[]> => {
    const response = await fetch(`${SERVER_URL}/api/messages/${threadId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": userId,
      },
      body: JSON.stringify({ content }),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "メッセージの送信に失敗しました");
    }

    return await response.json();
  },
};
