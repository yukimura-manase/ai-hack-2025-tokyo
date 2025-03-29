import { BasicLayout } from "@/components/layouts/basic-layout";
import { GoogleLoginButton } from "@/components/shared/ui-elements/GoogleLoginButton";

export const LoginPage = () => {
  return (
    <BasicLayout>
      <section className="w-full h-full flex flex-col gap-6 items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#3BB4C1]">
            ログイン/新規登録
          </h2>

          <h3 className="text-lg  text-center mb-6">
            無料アカウント作成で、アプリが使用可能になります。
          </h3>

          <div>
            <div className="flex items-center justify-center gap-4 mt-6 text-center">
              <GoogleLoginButton />
            </div>
          </div>
        </div>
      </section>
    </BasicLayout>
  );
};
