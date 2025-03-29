import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/shared/ui-elements/card";
import { Skeleton } from "@/components/shared/ui-elements/skeleton";
import {
  MessageRes,
  ThreadRes,
  User,
} from "@chemical-data-search-ai-agent/shared";
import { ChatBoxHeader } from "./parts/chatbox-header";
import { MessageInput } from "./parts/message-input";
import { MessageUi } from "./parts/message";
import { useEffect, useRef, useState } from "react";
import { threadApi } from "@/apis/threadApi";
import { useParams } from "react-router-dom";

interface ChatBoxProps {
  user: User;
}

export const ChatBox = ({ user }: ChatBoxProps) => {
  const [thread, setThread] = useState<ThreadRes | null>(null);
  const [messages, setMessages] = useState<MessageRes[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { threadId } = useParams<{ threadId: string }>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchThread = async () => {
    if (!threadId) return;

    try {
      setIsLoading(true);
      setError(null);
      const threadData = await threadApi.getThread(threadId, user.userId);
      setThread(threadData);
    } catch (err) {
      setError("スレッドの取得に失敗しました");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // メッセージ一覧を取得
  const fetchMessages = async () => {
    if (!threadId) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await threadApi.getMessages(threadId, user.userId);
      setMessages(response.messages);
    } catch (err) {
      setError("メッセージの取得に失敗しました");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // メッセージが送信された後の処理
  const handleMessageSent = () => {
    fetchMessages();
  };

  // スクロールを最下部に移動
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // threadIdが変更されたらスレッド詳細とメッセージを取得
  useEffect(() => {
    if (threadId && user.userId) {
      fetchThread();
      fetchMessages();
    } else {
      setThread(null);
      setMessages([]);
    }
  }, [threadId, user.userId]);

  // メッセージが更新されたらスクロールを最下部に移動
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Card className="w-full h-[700px] flex flex-col">
      <CardHeader className="border-b p-4">
        <ChatBoxHeader
          thread={thread || undefined}
          user={user}
          onTitleUpdate={(updatedThread) => setThread(updatedThread)}
        />
      </CardHeader>

      {/* チャットメッセージ */}
      <CardContent className="overflow-y-auto p-4 space-y-4 flex-1">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 p-4">{error}</div>
        ) : !threadId ? (
          <div className="text-center text-gray-500 p-4">
            左側のリストからスレッドを選択するか、新しいスレッドを作成してください
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 p-4">
            メッセージがありません。最初のメッセージを送信してください
          </div>
        ) : (
          messages.map((message) => (
            <MessageUi key={message.messageId} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* テキスト入力 */}
      <CardFooter className="border-t p-4">
        <MessageInput user={user} onMessageSent={handleMessageSent} />
      </CardFooter>
    </Card>
  );
};
