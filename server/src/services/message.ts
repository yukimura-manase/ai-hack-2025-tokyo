import { globalPrisma } from "../libs/dbClient.js";
import { ChatAiLogic } from "@/logic/chat-ai/chat-ai.js";
import type { Thread } from "@chemical-data-search-ai-agent/shared/src/types/thread.js";
import type { Message } from "@prisma/client";
import { Sender } from "@chemical-data-search-ai-agent/shared/src/types/message.js";
import { updateThreadTitle } from "./thread.js";

/**
 * スレッド内のメッセージ一覧を取得する
 * @param threadId スレッドID
 * @param userId ユーザーID（認証用）
 * @returns Message[] メッセージ一覧
 */
export const getMessagesByThreadId = async (
  threadId: string,
  userId: string
): Promise<Message[]> => {
  try {
    // スレッドの所有者確認
    const thread: Thread | null = await globalPrisma.thread.findFirst({
      where: {
        threadId,
        userId,
      },
    });

    if (!thread) {
      throw new Error("スレッドが見つかりません");
    }

    // メッセージ一覧取得
    const messages: Message[] = await globalPrisma.message.findMany({
      where: { threadId },
      orderBy: { createdAt: "asc" },
    });

    return messages;
  } catch (error) {
    console.error("メッセージ一覧の取得に失敗しました:", error);
    throw error;
  }
};

/**
 * ユーザーメッセージを保存し、AI応答を生成・保存する
 * @param threadId スレッドID
 * @param userId ユーザーID
 * @param content メッセージ内容
 * @returns [ユーザーメッセージ, AI応答メッセージ]
 */
export const createMessageAndAIResponse = async (
  threadId: string,
  userId: string,
  content: string
) => {
  try {
    // スレッドの所有者確認
    const thread = await globalPrisma.thread.findFirst({
      where: {
        threadId,
        userId,
      },
    });

    if (!thread) {
      throw new Error("スレッドが見つかりません");
    }

    // ユーザーメッセージを保存
    const userMessage: Message = await globalPrisma.message.create({
      data: {
        userId,
        threadId,
        sender: Sender.USER,
        content,
      },
    });

    // AI応答を生成
    const aiResponseContent = await ChatAiLogic.generateAIResponse(content);

    // AI応答を保存
    const aiMessage: Message = await globalPrisma.message.create({
      data: {
        userId,
        threadId,
        sender: Sender.AI,
        content: aiResponseContent,
      },
    });

    // スレッドの更新日時を更新
    await globalPrisma.thread.update({
      where: { threadId },
      data: { updatedAt: new Date() },
    });

    // メッセージ数を確認し、初回の会話（ユーザーメッセージ1つとAI応答1つの計2つ）の場合、スレッド名を自動生成
    const messageCount = await globalPrisma.message.count({
      where: { threadId },
    });

    if (messageCount === 2 && thread.title === "New Chat") {
      // 会話履歴から適切なスレッド名を生成
      const messages = [
        { sender: Sender.USER, content: userMessage.content },
        { sender: Sender.AI, content: aiMessage.content },
      ];

      const generatedTitle = await ChatAiLogic.generateThreadTitle(messages);

      // スレッド名を更新
      await updateThreadTitle(threadId, userId, generatedTitle);
    }

    return [userMessage, aiMessage];
  } catch (error) {
    console.error("メッセージの作成に失敗しました:", error);
    throw error;
  }
};

/**
 * アバターメッセージを保存する（斉藤美咲用）
 * ユーザーメッセージとAI応答を保存する
 * @param userId ユーザーID
 * @param threadId スレッドID
 * @param userContent ユーザーメッセージの内容
 * @param aiContent AI応答メッセージの内容
 * @returns [ユーザーメッセージ, AI応答メッセージ]
 */
export const createAvatarMessagePair = async (
  userId: string,
  threadId: string,
  userContent: string,
  aiContent: string
) => {
  try {
    // スレッドの所有者確認
    const thread = await globalPrisma.thread.findFirst({
      where: {
        threadId,
        userId,
      },
    });

    if (!thread) {
      throw new Error("スレッドが見つかりません");
    }

    // ユーザーメッセージを保存
    const userMessage: Message = await globalPrisma.message.create({
      data: {
        userId,
        threadId,
        sender: Sender.USER,
        content: userContent,
      },
    });

    // AI応答を保存
    const aiMessage: Message = await globalPrisma.message.create({
      data: {
        userId,
        threadId,
        sender: Sender.AI,
        content: aiContent,
      },
    });

    // スレッドの更新日時を更新
    await globalPrisma.thread.update({
      where: { threadId },
      data: { updatedAt: new Date() },
    });

    return [userMessage, aiMessage];
  } catch (error) {
    console.error("アバターメッセージの作成に失敗しました:", error);
    throw error;
  }
};
