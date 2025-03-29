import { BasicLayout } from "@/components/layouts/basic-layout";
import { Button } from "@/components/shared/ui-elements/button";
import { useHomePage } from "./hooks/useHomePage";

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
      <section className="w-full h-full flex flex-col gap-6 items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#3BB4C1]">
            AIエージェントとの会話
          </h2>

          <div className="mt-6 text-center">
            <Button
              onClick={handleLogout}
              className="bg-black hover:bg-[#3BB4C1] text-white"
            >
              ログアウト
            </Button>
          </div>
        </div>
      </section>
    </BasicLayout>
  );
};
