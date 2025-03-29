/**
 * メッセージ入力コンポーネント
 */
import { Button } from "@/components/shared/ui-elements/button";
import { Textarea } from "@/components/shared/ui-elements/textarea";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { FormEvent, useState } from "react";
import { User } from "@chemical-data-search-ai-agent/shared";
import { messageApi } from "@/apis/messageApi";
import { useParams } from "react-router-dom";

interface MessageInputProps {
  user: User;
  onMessageSent: () => void;
}

export const MessageInput = ({ user, onMessageSent }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { threadId } = useParams<{ threadId: string }>();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !threadId) return;

    try {
      setIsLoading(true);
      await messageApi.sendMessage(threadId, user.userId, message);
      setMessage("");
      onMessageSent();
    } catch (error) {
      console.error("メッセージ送信エラー:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enterでメッセージを送信
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-end gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="メッセージを入力..."
          className="flex-1 min-h-[80px] resize-none"
          disabled={isLoading || !threadId}
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !message.trim() || !threadId}
          className="h-10 w-10"
        >
          <PaperPlaneIcon className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-xs text-gray-500 mt-2">Ctrl + Enter で送信</div>
    </form>
  );
};
