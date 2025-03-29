import { Atom, atom, useAtom } from "jotai";
import { User } from "@chemical-data-search-ai-agent/shared";

/** ユーザー情報を保持するAtom */
export const userAtom = atom<User | null>(null);

/** ユーザーがログインしているかどうかを判定するAtom */
export const isLoggedInAtom: Atom<boolean> = atom((get) => {
  return get(userAtom) !== null;
});

/** ユーザー情報を操作するカスタムフック */
export const useUser = () => {
  const [user, setUser] = useAtom<User | null>(userAtom);
  const [isLoggedIn] = useAtom<boolean>(isLoggedInAtom);

  /** ユーザー情報をローカルストレージにユーザー情報を保存する。 */
  const setUserInLocalStorage = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  /** ローカルストレージからユーザー情報を削除する */
  const removeUserInLocalStorage = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  /** ローカルストレージからユーザー情報を復元する */
  const restoreUserFromLocalStorage = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData: User = JSON.parse(storedUser);
        setUser(userData);
        return true;
      } catch (error) {
        console.error("Failed to parse stored user data", error);
        localStorage.removeItem("user");
      }
    }
    return false;
  };

  return {
    user,
    isLoggedIn,
    setUserInLocalStorage,
    removeUserInLocalStorage,
    restoreUserFromLocalStorage,
  };
};
