import { Button } from "@/components/shared/ui-elements/button";
import { ThreadRes, User } from "@chemical-data-search-ai-agent/shared";
import { PlusIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { threadApi } from "@/apis/threadApi";
import { useNavigate, useParams } from "react-router-dom";

interface ThreadListProps {
  user: User;
}

export const ThreadList = ({ user }: ThreadListProps) => {
  const [threads, setThreads] = useState<ThreadRes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { threadId } = useParams<{ threadId: string }>();

  // スレッド一覧を取得
  const fetchThreads = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await threadApi.getThreads(user.userId);
      setThreads(response.threads);
    } catch (err) {
      setError("スレッド一覧の取得に失敗しました");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 新しいスレッドを作成
  const handleCreateThread = async () => {
    try {
      const newThread = await threadApi.createThread(user.userId);
      setThreads((prev) => [newThread, ...prev]);
      navigate(`/talk-room/${newThread.threadId}`);
    } catch (err) {
      setError("スレッドの作成に失敗しました");
      console.error(err);
    }
  };

  // スレッドを選択
  const handleSelectThread = (selectedThreadId: string) => {
    navigate(`/talk-room/${selectedThreadId}`);
  };

  // コンポーネントマウント時にスレッド一覧を取得
  useEffect(() => {
    if (user.userId) {
      fetchThreads();
    }
  }, [user.userId]);

  return (
    <div className="w-64 h-full border-r flex flex-col">
      {/* 新規スレッド作成ボタン */}
      <div className="p-4 border-b">
        <Button
          onClick={handleCreateThread}
          className="w-full flex items-center justify-center"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          新しいチャット
        </Button>
      </div>

      {/* スレッド一覧 */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center">読み込み中...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : threads.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            スレッドがありません
          </div>
        ) : (
          <ul>
            {threads.map((thread) => (
              <li
                key={thread.threadId}
                className={`p-4 cursor-pointer hover:bg-gray-100 ${
                  threadId === thread.threadId ? "bg-gray-100" : ""
                }`}
                onClick={() => handleSelectThread(thread.threadId)}
              >
                <div className="font-medium truncate">
                  {thread.title || "New Chat"}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(thread.createdAt).toLocaleDateString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
