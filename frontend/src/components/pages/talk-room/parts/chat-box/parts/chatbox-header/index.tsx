/**
 * チャットボックスのヘッダー
 */
import { ThreadRes, User } from "@chemical-data-search-ai-agent/shared";
import { useState, useRef, useEffect } from "react";
import { threadApi } from "@/apis/threadApi";
import { Pencil } from "lucide-react";
import { Button } from "@/components/shared/ui-elements/button";
import { Input } from "@/components/shared/ui-elements/input";
import { useParams } from "react-router-dom";

interface ChatBoxHeaderProps {
  thread?: ThreadRes;
  user?: User;
  onTitleUpdate?: (updatedThread: ThreadRes) => void;
}

export const ChatBoxHeader = ({
  thread,
  user,
  onTitleUpdate,
}: ChatBoxHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(thread?.title || "New Chat");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { threadId } = useParams<{ threadId: string }>();

  // スレッドが変更されたらタイトルも更新
  useEffect(() => {
    setTitle(thread?.title || "New Chat");
  }, [thread]);

  // 編集モードになったらinputにフォーカス
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setTitle(thread?.title || "New Chat");
    setIsEditing(false);
    setError(null);
  };

  const handleSave = async () => {
    if (!thread || !threadId || !user) return;

    try {
      setError(null);
      const updatedThread = await threadApi.updateThreadTitle(
        threadId,
        user.userId,
        title
      );

      setIsEditing(false);

      // 親コンポーネントに更新を通知
      if (onTitleUpdate) {
        onTitleUpdate(updatedThread);
      }
    } catch (err) {
      console.error(err);
      setError("タイトルの更新に失敗しました");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex-1">
        {isEditing ? (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Input
                ref={inputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-8"
                placeholder="スレッドタイトル"
              />
              <Button size="sm" onClick={handleSave}>
                保存
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                キャンセル
              </Button>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold">
              {thread
                ? thread.title || "New Chat"
                : "チャットを選択してください"}
            </h2>
            {thread && user && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleEditClick}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
        {thread && (
          <p className="text-sm text-gray-500">
            {new Date(thread.createdAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
};
