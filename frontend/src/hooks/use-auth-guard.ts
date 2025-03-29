import { useUser } from "@/stores/user";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * 認証状態を確認し、未ログイン時にリダイレクトするカスタムフック。
 * @param redirectTo リダイレクト先のパス（デフォルトは/login）
 */
export const useAuthGuard = (redirectTo = "/login") => {
  const { isLoggedIn, restoreUserFromLocalStorage } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // ローカルストレージからユーザー情報を復元を試みる
    const restored = restoreUserFromLocalStorage();

    // ログインしていない場合はリダイレクト
    if (!restored && !isLoggedIn) {
      navigate(redirectTo);
    }
  }, [isLoggedIn, navigate, redirectTo]);

  return { isLoggedIn };
};
