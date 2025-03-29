import { BasicLayout } from "@/components/layouts/basic-layout";
import { Button } from "@/components/shared/ui-elements/button";
import { Input } from "@/components/shared/ui-elements/input";
import { Label } from "@/components/shared/ui-elements/label";
import { useSignUp } from "./hooks/useSignUp";

/**
 * GoogleAuthでログイン済みのUserが新規登録を行うページ。
 */
export const SignUpPage = () => {
  const { signUpFormData, isSubmitting, error, handleChange, handleSubmit } =
    useSignUp();

  return (
    <BasicLayout>
      <div className="container max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium mb-6"></h1>
          <div className="text-[#3BB4C1] text-xl font-medium">新規登録</div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700">
              名前 <span className="text-[#FF9966]">必須</span>
            </Label>
            <Input
              id="name"
              value={signUpFormData.name}
              onChange={handleChange}
              placeholder="名前を入力"
              className="w-full border rounded-md p-2"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">
              メールアドレス <span className="text-[#FF9966]">必須</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={signUpFormData.email}
              onChange={handleChange}
              placeholder="登録するメールアドレスを入力"
              className="w-full border rounded-md p-2"
              required
              readOnly={Boolean(signUpFormData.googleId)} // Google認証済みの場合は編集不可
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-gray-700">
              企業名 <span className="text-[#FF9966]">必須</span>
            </Label>
            <Input
              id="companyName"
              value={signUpFormData.companyName}
              onChange={handleChange}
              placeholder="企業名を入力"
              className="w-full border rounded-md p-2"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="affiliation" className="text-gray-700">
              組織名
            </Label>
            <Input
              id="affiliation"
              value={signUpFormData.affiliation}
              onChange={handleChange}
              placeholder="組織名を入力"
              className="w-full border rounded-md p-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position" className="text-gray-700">
              役職
            </Label>
            <Input
              id="position"
              value={signUpFormData.position}
              onChange={handleChange}
              placeholder="役職を入力"
              className="w-full border rounded-md p-2"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#5ECFBC] hover:bg-[#4DBFAC] text-white py-3 rounded-md"
            disabled={isSubmitting}
          >
            {isSubmitting ? "登録中..." : "新規登録"}
          </Button>
        </form>
      </div>
    </BasicLayout>
  );
};
