import { Hono } from "hono";
import { createMessageAndAIResponse } from "../../services/message.js";
import { ChatAiLogic } from "../../logic/chat-ai/chat-ai.js";

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

/** アバター会話API - 感情分析とAI応答の生成 */
messageRouter.post("/avatar/chat", async (c) => {
  try {
    // リクエストボディからメッセージ内容を取得
    const body = await c.req.json();
    const { content } = body;

    if (!content || typeof content !== "string") {
      return c.json({ error: "メッセージ内容が必要です" }, 400);
    }

    // 並行してAI応答と感情分析を実行
    const [aiResponse, emotion] = await Promise.all([
      ChatAiLogic.generateAIResponse(content),
      ChatAiLogic.analyzeEmotion(content),
    ]);

    // フロントエンド用にレスポンス形式を整形
    const response = {
      text: aiResponse,
      emotion: emotion as "neutral" | "happy" | "sad" | "surprised" | "angry",
      timestamp: new Date(),
    };

    return c.json(response);
  } catch (error) {
    console.error("アバター会話APIエラー:", error);
    return c.json({ error: "AI応答の生成に失敗しました" }, 500);
  }
});

/** Story API Ver. 斉藤 美咲（さいとう みさき）からのメッセージを生成 */
messageRouter.post("/avatar/make-hiroin", async (c) => {
  try {
    // リクエストボディからメッセージ内容を取得
    const body = await c.req.json();
    const { content } = body;

    if (!content || typeof content !== "string") {
      return c.json({ error: "メッセージ内容が必要です" }, 400);
    }

    // 並行してAI応答と感情分析を実行
    const [aiResponse, emotion] = await Promise.all([
      ChatAiLogic.generateAIResponse(content),
      ChatAiLogic.analyzeEmotion(content),
    ]);

    // フロントエンド用にレスポンス形式を整形
    const response = {
      text: aiResponse,
      emotion: emotion as "neutral" | "happy" | "sad" | "surprised" | "angry",
      timestamp: new Date(),
    };

    return c.json(response);
  } catch (error) {
    console.error("アバター会話APIエラー:", error);
    return c.json({ error: "AI応答の生成に失敗しました" }, 500);
  }
});

/** Story API Ver. 中村 颯真（なかむら そうま）からのメッセージを生成 */
messageRouter.post("/avatar/make-sakuma", async (c) => {
  try {
    // リクエストボディからメッセージ内容を取得
    const body = await c.req.json();
    const { content } = body;

    if (!content || typeof content !== "string") {
      return c.json({ error: "メッセージ内容が必要です" }, 400);
    }

    // 並行してAI応答と感情分析を実行
    const [aiResponse, emotion] = await Promise.all([
      ChatAiLogic.generateAIResponse(content),
      ChatAiLogic.analyzeEmotion(content),
    ]);

    // フロントエンド用にレスポンス形式を整形
    const response = {
      text: aiResponse,
      emotion: emotion as "neutral" | "happy" | "sad" | "surprised" | "angry",
      timestamp: new Date(),
    };

    return c.json(response);
  } catch (error) {
    console.error("アバター会話APIエラー:", error);
    return c.json({ error: "AI応答の生成に失敗しました" }, 500);
  }
});

export default messageRouter;
