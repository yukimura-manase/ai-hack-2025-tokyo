import { Skeleton } from "@/components/shared/ui-elements/skeleton";
import { Home, MessageSquare, User } from "lucide-react";

export const PageLoading = () => {
  return (
    <div className="flex min-h-screen w-full">
      {/* サイドバー */}
      <div className="w-[220px] border-r bg-background flex flex-col">
        <div className="p-4 border-b">
          <Skeleton className="h-6 w-[180px]" />
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Home className="h-5 w-5 text-muted-foreground" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1">
        {/* ヘッダー */}
        <div className="h-16 bg-gradient-to-r from-green-500 to-blue-500 flex items-center px-6">
          <Skeleton className="h-8 w-[400px]" />
        </div>

        {/* コンテンツエリア */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-20 rounded-md" />
          </div>

          <div className="space-y-8 max-w-3xl">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
