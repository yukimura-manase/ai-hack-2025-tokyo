import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/stores/user";

export const useHomePage = () => {
  const navigate = useNavigate();
  const {
    user,
    isLoggedIn,
    removeUserInLocalStorage,
    restoreUserFromLocalStorage,
  } = useUser();

  // ローカルストレージからユーザー情報を復元する。
  useEffect(() => {
    if (!isLoggedIn) {
      const restored = restoreUserFromLocalStorage();
      if (!restored) {
        // ユーザー情報がない場合はログインページにリダイレクト
        navigate("/login");
      }
    }
  }, [isLoggedIn, navigate]);

  // ログアウト処理
  const handleLogout = () => {
    removeUserInLocalStorage();
    navigate("/login");
  };

  return {
    user,
    isLoggedIn,
    removeUserInLocalStorage,
    restoreUserFromLocalStorage,
    handleLogout,
  };
};
