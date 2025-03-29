import type { Thread } from "@chemical-data-search-ai-agent/shared/src/types/thread.js";
import { globalPrisma } from "../libs/dbClient.js";

/**
 * ユーザーのスレッド一覧を取得する。
 * @param userId ユーザーID
 * @returns スレッド一覧
 */
export const getThreadsByUserId = async (userId: string) => {
  try {
    const threads: Thread[] = await globalPrisma.thread.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 100, // 最大100件まで取得
    });

    return threads;
  } catch (error) {
    console.error("スレッド一覧の取得に失敗しました:", error);
    throw error;
  }
};

/**
 * 新しいスレッドを作成する。
 * @param userId ユーザーID
 * @returns 作成されたスレッド
 */
export const createThread = async (userId: string, title: string) => {
  try {
    const thread: Thread = await globalPrisma.thread.create({
      data: {
        userId,
        title: title || "New Chat",
      },
    });

    return thread;
  } catch (error) {
    console.error("スレッドの作成に失敗しました:", error);
    throw error;
  }
};

/**
 * スレッドの詳細を取得する。
 * @param threadId スレッドID
 * @param userId ユーザーID（認証用）
 * @returns スレッド詳細
 */
export const getThreadById = async (
  threadId: string,
  userId: string
): Promise<Thread> => {
  try {
    const thread: Thread | null = await globalPrisma.thread.findFirst({
      where: {
        threadId,
        userId,
      },
    });

    if (!thread) {
      throw new Error("スレッドが見つかりません");
    }

    return thread;
  } catch (error) {
    console.error("スレッドの取得に失敗しました:", error);
    throw error;
  }
};

/**
 * スレッドのタイトルを更新する。
 * @param threadId スレッドID
 * @param userId ユーザーID（認証用）
 * @param title 新しいタイトル
 * @returns 更新されたスレッド
 */
export const updateThreadTitle = async (
  threadId: string,
  userId: string,
  title: string
): Promise<Thread> => {
  try {
    // まず存在確認
    const existingThread = await getThreadById(threadId, userId);

    if (!existingThread) {
      throw new Error("スレッドが見つかりません");
    }

    const updatedThread: Thread = await globalPrisma.thread.update({
      where: {
        threadId,
        userId,
      },
      data: {
        title,
      },
    });

    return updatedThread;
  } catch (error) {
    console.error("スレッドタイトルの更新に失敗しました:", error);
    throw error;
  }
};
