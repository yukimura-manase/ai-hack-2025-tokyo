import { userApi } from "@/apis/userApi";
import { BasicLayout } from "@/components/layouts/basic-layout";
import { Button } from "@/components/shared/ui-elements/button";
import { Input } from "@/components/shared/ui-elements/input";
import { Label } from "@/components/shared/ui-elements/label";
import { Separator } from "@/components/shared/ui-elements/separator";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { useUser } from "@/stores/user";
import { UpdateUserInput } from "@chemical-data-search-ai-agent/shared";
import { useState } from "react";

export const MyPage = () => {
  // 認証ガードを使用
  useAuthGuard();

  const { user, setUserInLocalStorage } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateUserInput>({
    name: user?.name || "",
    companyName: user?.companyName || "",
    affiliation: user?.affiliation || "",
    position: user?.position || "",
  });

  console.log("user", user);

  // 編集モードの切り替え
  const toggleEditMode = () => {
    if (isEditing) {
      // 編集モードを終了する場合は、フォームデータをリセット
      setFormData({
        name: user?.name || "",
        companyName: user?.companyName || "",
        affiliation: user?.affiliation || "",
        position: user?.position || "",
      });
    }
    setIsEditing(!isEditing);
  };

  // フォームの入力値を更新
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ユーザー情報を更新
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      setIsLoading(true);

      // APIを呼び出してユーザー情報を更新
      const updatedUser = await userApi.updateUser(user.userId, formData);

      // ローカルストレージとグローバルステートを更新
      setUserInLocalStorage(updatedUser);

      // 編集モードを終了
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("ユーザー情報の更新に失敗しました。");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div>ローディング中...</div>;
  }

  return (
    <BasicLayout>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">マイページ</h2>

        <div className="flex justify-end mb-4">
          <Button
            onClick={toggleEditMode}
            variant={isEditing ? "outline" : "default"}
          >
            {isEditing ? "キャンセル" : "編集"}
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">名前</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="companyName">会社名</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="affiliation">所属</Label>
                  <Input
                    id="affiliation"
                    name="affiliation"
                    value={formData.affiliation || ""}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label htmlFor="position">役職</Label>
                  <Input
                    id="position"
                    name="position"
                    value={formData.position || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="pt-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "更新中..." : "更新する"}
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  メールアドレス
                </h2>
                <p className="mt-1">{user.email}</p>
              </div>

              <Separator />

              <div>
                <h2 className="text-sm font-medium text-gray-500">名前</h2>
                <p className="mt-1">{user.name}</p>
              </div>

              <Separator />

              <div>
                <h2 className="text-sm font-medium text-gray-500">会社名</h2>
                <p className="mt-1">{user.companyName}</p>
              </div>

              <Separator />

              <div>
                <h2 className="text-sm font-medium text-gray-500">所属</h2>
                <p className="mt-1">{user.affiliation || "未設定"}</p>
              </div>

              <Separator />

              <div>
                <h2 className="text-sm font-medium text-gray-500">役職</h2>
                <p className="mt-1">{user.position || "未設定"}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </BasicLayout>
  );
};
