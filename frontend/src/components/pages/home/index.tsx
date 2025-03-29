import { BasicLayout } from "@/components/layouts/basic-layout";
import { useHomePage } from "./hooks/useHomePage";
import { MakeinAvatar } from "@/components/shared/ui-parts/makein-avatar";

/**
 * エントリーポイントとなる Top Page
 */
export const HomePage = () => {
  const { isLoggedIn, handleLogout } = useHomePage();

  if (!isLoggedIn) {
    return null; // ログインチェック中は何も表示しない
  }

  return (
    <BasicLayout>
      <section className="flex gap-5 w-[100%] h-[calc(100vh-64px)]">
        <MakeinAvatar url="/make-hiroin.vrm" />
      </section>
    </BasicLayout>
  );
};
