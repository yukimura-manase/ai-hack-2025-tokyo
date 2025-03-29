import { CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { userApi } from "@/apis/userApi";
import { useUser } from "@/stores/user";

// Google認証情報のデコード結果の型
interface GoogleUserInfo {
  email: string;
  name: string;
  sub: string; // Google ID
  picture?: string;
}

export const useGoogleLoginButton = () => {
  const navigate = useNavigate();
  const { setUserInLocalStorage } = useUser();

  /** ログイン成功時の処理 */
  const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      throw new Error("credentialResponse.credential is undefined");
    }

    try {
      // JWT をデコードしてユーザー情報を取得する。
      const decodedGoogleUserInfo: GoogleUserInfo = jwtDecode(
        credentialResponse.credential
      );
      console.log("ログイン成功:", decodedGoogleUserInfo);

      // プロフィール画像URLがあればローカルストレージに保存
      if (decodedGoogleUserInfo.picture) {
        localStorage.setItem("userProfileImage", decodedGoogleUserInfo.picture);
      }

      // ユーザーが存在するか確認
      const { exists, user } = await userApi.verifyGoogleAuth(
        decodedGoogleUserInfo.email
      );

      if (exists && user) {
        // 既存ユーザーの場合はローカルストレージに保存(端末で永続化)する。
        setUserInLocalStorage(user);
        navigate("/"); // ホームページにリダイレクト
      } else {
        // 新規ユーザーの場合はサインアップページに遷移する。
        // Google認証情報をセッションストレージに一時保存する。
        sessionStorage.setItem(
          "googleAuthInfo",
          JSON.stringify({
            email: decodedGoogleUserInfo.email,
            name: decodedGoogleUserInfo.name,
            googleId: decodedGoogleUserInfo.sub,
            picture: decodedGoogleUserInfo.picture,
          })
        );
        navigate("/sign-up"); // サインアップページにリダイレクトする。
      }
    } catch (error) {
      console.error("認証処理中にエラーが発生しました:", error);
      alert("認証処理中にエラーが発生しました。もう一度お試しください。");
    }
  };

  /** ログイン失敗時の処理 */
  const handleLoginError = () => {
    console.error("ログインに失敗しました");
    alert("ログインに失敗しました。もう一度お試しください。");
  };

  return { handleLoginSuccess, handleLoginError };
};
