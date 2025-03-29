import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "@/apis/userApi";
import { useUser } from "@/stores/user";

// Google認証情報の型
interface GoogleAuthInfo {
  email: string;
  name: string;
  googleId: string;
  picture?: string;
}

export const useSignUp = () => {
  const navigate = useNavigate();
  const { setUserInLocalStorage } = useUser();

  // サブミット中かどうか
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // フォーム状態
  const [signUpFormData, setSignUpFormData] = useState({
    name: "",
    email: "",
    companyName: "",
    affiliation: "",
    position: "",
    googleId: "",
  });

  // Google認証情報を取得する。
  useEffect(() => {
    // セッションストレージからGoogle認証情報を取得 & 初期値をFormDataに設定する。
    const googleAuthInfoStr = sessionStorage.getItem("googleAuthInfo");
    if (googleAuthInfoStr) {
      try {
        const googleAuthInfo: GoogleAuthInfo = JSON.parse(googleAuthInfoStr);
        setSignUpFormData((prev) => ({
          ...prev,
          name: googleAuthInfo.name,
          email: googleAuthInfo.email,
          googleId: googleAuthInfo.googleId,
        }));

        // プロフィール画像URLがあればローカルストレージに保存
        if (googleAuthInfo.picture) {
          localStorage.setItem("userProfileImage", googleAuthInfo.picture);
        }
      } catch (error) {
        console.error("Failed to parse Google auth info", error);
        sessionStorage.removeItem("googleAuthInfo");
      }
    } else {
      // Google認証情報がない場合はログインページにリダイレクトする。
      navigate("/login");
    }
  }, [navigate]);

  // 入力値の変更を処理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSignUpFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  /** 新規登録フォームのサブミット */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // バリデーション
    if (
      !signUpFormData.name ||
      !signUpFormData.email ||
      !signUpFormData.companyName
    ) {
      setError("必須項目を入力してください");
      return;
    }

    try {
      setIsSubmitting(true);

      // ユーザー登録API呼び出し
      const newUser = await userApi.registerUser({
        name: signUpFormData.name,
        email: signUpFormData.email,
        companyName: signUpFormData.companyName,
        affiliation: signUpFormData.affiliation || undefined,
        position: signUpFormData.position || undefined,
        googleId: signUpFormData.googleId,
      });

      // 登録成功したら、ローカルストレージにGoogle認証情報を保存(端末で永続化)する。
      setUserInLocalStorage(newUser);

      // セッションストレージ(一時保存したGoogle認証情報)をクリアする。
      sessionStorage.removeItem("googleAuthInfo");

      // ホームページにリダイレクト
      navigate("/");
    } catch (error) {
      console.error("ユーザー登録に失敗しました", error);
      setError("ユーザー登録に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    signUpFormData,
    isSubmitting,
    error,
    handleChange,
    handleSubmit,
  };
};
