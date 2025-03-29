import { Hono } from "hono";
import { createMessageAndAIResponse } from "../../services/message.js";

const messageRouter = new Hono();

/** メッセージ作成API（AI応答も生成） */
messageRouter.post("/:threadId", async (c) => {
  try {
    const threadId = c.req.param("threadId");

    // 認証情報からユーザーIDを取得（実際の認証実装は別途必要）
    const userId = c.req.header("X-User-Id");
    if (!userId) {
      return c.json({ error: "ユーザーIDが必要です" }, 401);
    }

    // リクエストボディからメッセージ内容を取得
    const body = await c.req.json();
    const { content } = body;

    if (!content || typeof content !== "string") {
      return c.json({ error: "メッセージ内容が必要です" }, 400);
    }

    // ユーザーメッセージを保存し、AI応答を生成・保存
    const [userMessage, aiMessage] = await createMessageAndAIResponse(
      threadId,
      userId,
      content
    );

    // フロントエンド用にレスポンス形式を変換
    const responseMessages = [
      {
        messageId: userMessage.messageId,
        content: userMessage.content,
        sender: userMessage.sender,
        createdAt: userMessage.createdAt,
      },
      {
        messageId: aiMessage.messageId,
        content: aiMessage.content,
        sender: aiMessage.sender,
        createdAt: aiMessage.createdAt,
      },
    ];

    return c.json(responseMessages);
  } catch (error) {
    console.error("メッセージ作成エラー:", error);
    if (
      error instanceof Error &&
      error.message === "スレッドが見つかりません"
    ) {
      return c.json({ error: "スレッドが見つかりません" }, 404);
    }
    return c.json({ error: "メッセージの作成に失敗しました" }, 500);
  }
});

export default messageRouter;
