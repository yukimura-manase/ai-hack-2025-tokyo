import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import {
  createThread,
  getThreadById,
  getThreadsByUserId,
  updateThreadTitle,
} from "../../services/thread.js";
import { getMessagesByThreadId } from "../../services/message.js";
import type {
  Thread,
  ThreadRes,
} from "@chemical-data-search-ai-agent/shared/src/types/thread.js";
import type { Message } from "@chemical-data-search-ai-agent/shared/src/types/message.js";

const threadRouter = new Hono();

/** スレッド一覧取得API */
threadRouter.get("/", async (c) => {
  try {
    // 認証情報からユーザーIDを取得（実際の認証実装は別途必要）
    const userId = c.req.header("X-User-Id");
    if (!userId) {
      return c.json({ error: "ユーザーIDが必要です" }, 401);
    }

    const threads = await getThreadsByUserId(userId);

    // フロントエンド用にレスポンス形式を変換
    const responseThreads = threads.map((thread: Thread) => ({
      threadId: thread.threadId,
      title: thread.title,
      createdAt: thread.createdAt,
      updatedAt: thread.updatedAt,
    }));

    return c.json({ threads: responseThreads });
  } catch (error) {
    console.error("スレッド一覧取得エラー:", error);
    return c.json({ error: "スレッド一覧の取得に失敗しました" }, 500);
  }
});

/** 新規スレッド作成API */
threadRouter.post("/", async (c) => {
  try {
    // 認証情報からユーザーIDを取得（実際の認証実装は別途必要）
    const userId = c.req.header("X-User-Id");
    if (!userId) {
      return c.json({ error: "ユーザーIDが必要です" }, 401);
    }

    const thread: Thread = await createThread(userId, "New Chat");

    // フロントエンド用にレスポンス形式を変換
    const responseThread: ThreadRes = {
      threadId: thread.threadId,
      title: "New Chat", // デフォルトタイトル
      createdAt: thread.createdAt,
      updatedAt: thread.updatedAt,
    };

    return c.json(responseThread);
  } catch (error) {
    console.error("スレッド作成エラー:", error);
    return c.json({ error: "スレッドの作成に失敗しました" }, 500);
  }
});

/** スレッド詳細取得API */
threadRouter.get("/:threadId", async (c) => {
  try {
    const threadId = c.req.param("threadId");

    // 認証情報からユーザーIDを取得（実際の認証実装は別途必要）
    const userId = c.req.header("X-User-Id");
    if (!userId) {
      return c.json({ error: "ユーザーIDが必要です" }, 401);
    }

    const thread: Thread = await getThreadById(threadId, userId);

    // フロントエンド用にレスポンス形式を変換
    const responseThread: ThreadRes = {
      threadId: thread.threadId,
      title: thread.title,
      createdAt: thread.createdAt,
      updatedAt: thread.updatedAt,
    };

    return c.json(responseThread);
  } catch (error) {
    console.error("スレッド詳細取得エラー:", error);
    if (
      error instanceof Error &&
      error.message === "スレッドが見つかりません"
    ) {
      return c.json({ error: "スレッドが見つかりません" }, 404);
    }
    return c.json({ error: "スレッドの取得に失敗しました" }, 500);
  }
});

/** スレッド内のメッセージ一覧取得API */
threadRouter.get("/:threadId/messages", async (c) => {
  try {
    const threadId = c.req.param("threadId");

    // 認証情報からユーザーIDを取得（実際の認証実装は別途必要）
    const userId = c.req.header("X-User-Id");
    if (!userId) {
      return c.json({ error: "ユーザーIDが必要です" }, 401);
    }

    const messages: Message[] = await getMessagesByThreadId(threadId, userId);

    // フロントエンド用にレスポンス形式を変換
    const responseMessages = messages.map((message) => ({
      messageId: message.messageId,
      content: message.content,
      sender: message.sender,
      createdAt: message.createdAt,
    }));

    return c.json({ messages: responseMessages });
  } catch (error) {
    console.error("メッセージ一覧取得エラー:", error);
    if (
      error instanceof Error &&
      error.message === "スレッドが見つかりません"
    ) {
      return c.json({ error: "スレッドが見つかりません" }, 404);
    }
    return c.json({ error: "メッセージの取得に失敗しました" }, 500);
  }
});

// スレッドタイトル更新のバリデーションスキーマ
const updateThreadTitleSchema = z.object({
  title: z.string().min(1).max(100),
});

/** スレッドタイトル更新API */
threadRouter.patch(
  "/:threadId",
  zValidator("json", updateThreadTitleSchema),
  async (c) => {
    try {
      const threadId = c.req.param("threadId");
      const { title } = c.req.valid("json");

      // 認証情報からユーザーIDを取得（実際の認証実装は別途必要）
      const userId = c.req.header("X-User-Id");
      if (!userId) {
        return c.json({ error: "ユーザーIDが必要です" }, 401);
      }

      const thread: Thread = await updateThreadTitle(threadId, userId, title);

      // フロントエンド用にレスポンス形式を変換
      const responseThread: ThreadRes = {
        threadId: thread.threadId,
        title: thread.title,
        createdAt: thread.createdAt,
        updatedAt: thread.updatedAt,
      };

      return c.json(responseThread);
    } catch (error) {
      console.error("スレッドタイトル更新エラー:", error);
      if (
        error instanceof Error &&
        error.message === "スレッドが見つかりません"
      ) {
        return c.json({ error: "スレッドが見つかりません" }, 404);
      }
      return c.json({ error: "スレッドタイトルの更新に失敗しました" }, 500);
    }
  }
);

export default threadRouter;
