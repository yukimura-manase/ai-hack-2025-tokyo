import { MessageRes } from "@chemical-data-search-ai-agent/shared";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/shared/ui-elements/avatar";
import { cn } from "@/libs/utils";
import { useEffect, useState } from "react";
import { useUser } from "@/stores/user";

interface MessageUiProps {
  message: MessageRes;
}

/**
 * Message UI Component
 *
 * - メッセージの送信者(AI/User)によって表示を変える。
 */
export const MessageUi = ({ message }: MessageUiProps) => {
  const isUser = message.sender === "USER";
  const { user } = useUser();
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null);

  // ユーザープロフィール画像をローカルストレージから取得
  useEffect(() => {
    if (isUser) {
      // ローカルストレージからGoogleプロフィール画像URLを取得
      const profileImageUrl = localStorage.getItem("userProfileImage");
      setUserProfileImage(profileImageUrl);
    }
  }, [isUser]);

  return (
    <div
      className={cn(
        "flex items-start gap-4 w-full",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* アバター */}
      <Avatar
        className={cn("h-10 w-10", isUser ? "bg-blue-500" : "bg-green-500")}
      >
        <AvatarImage
          src={
            isUser ? userProfileImage || "/user-avatar.png" : "/make-hiroin.png"
          }
        />
        <AvatarFallback>
          {isUser ? user?.name?.charAt(0) || "U" : "AI"}
        </AvatarFallback>
      </Avatar>

      {/* メッセージ */}
      <div
        className={cn(
          "rounded-lg p-3 max-w-[80%]",
          isUser ? "bg-blue-100 text-blue-900" : "bg-green-100 text-green-900"
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <div className="text-xs mt-1 text-gray-500">
          {new Date(message.createdAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};
