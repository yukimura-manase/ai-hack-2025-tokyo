import { BasicLayout } from "@/components/layouts/basic-layout";
import { ChatBox } from "./parts/chat-box";
import { ThreadList } from "./parts/thread-list";
import { useUser } from "@/stores/user";
import { PageLoading } from "@/components/shared/ui-parts/page-loading";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { useParams } from "react-router-dom";

export const TalkRoomPage = () => {
  // 認証ガードを使用
  useAuthGuard();
  const { user, isLoggedIn } = useUser();
  const { threadId } = useParams<{ threadId: string }>();

  console.log("user", user);
  console.log("isLoggedIn", isLoggedIn);
  console.log("threadId from params", threadId);

  if (!user) {
    return <PageLoading />;
  }

  return (
    <BasicLayout>
      <div className="flex gap-5 w-[90%] h-[calc(100vh-64px)]">
        {/* スレッド一覧 */}
        <ThreadList user={user} />

        {/* チャットボックス */}
        <div className="flex-1 p-4">
          <ChatBox user={user} />
        </div>
      </div>
    </BasicLayout>
  );
};
